#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

// =============================================
// Configuration and Types
// =============================================

interface ServerConfig {
  server: {
    name: string;
    version: string;
  };
  security: {
    maxFileSize: number;
    maxInputLength: number;
    allowedExtensions: string[];
    allowedDirs: string[];
  };
}

const config: ServerConfig = {
  server: {
    name: process.env.SERVER_NAME || 'sdd-server',
    version: process.env.SERVER_VERSION || '0.1.0',
  },
  security: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '1048576'), // 1MB
    maxInputLength: parseInt(process.env.MAX_INPUT_LENGTH || '10000'),
    allowedExtensions: ['.md', '.txt'],
    allowedDirs: ['./output', './temp', './'],
  },
};

interface RequirementArgs {
  projectName: string;
  projectDescription: string;
  requirements: Array<{
    userStory: string;
    acceptanceCriteria: string[];
  }>;
  outputPath?: string;
}

interface DesignArgs {
  projectName: string;
  projectDescription: string;
  techStack: {
    frontend?: string;
    backend?: string;
    database?: string;
    infrastructure?: string;
  };
  components?: string[];
  dataModels?: string[];
  outputPath?: string;
}

interface TasksArgs {
  projectName: string;
  estimatedDuration: string;
  keyDeliverables: string[];
  tasks: Array<{
    name: string;
    description: string;
    acceptanceCriteria: string[];
    dependencies: string[];
    estimate: string;
    requirementRef?: string;
  }>;
  outputPath?: string;
}

// =============================================
// Custom Error Classes
// =============================================

class SddError extends Error {
  constructor(
    message: string,
    public code: string,
    public httpStatus: number = 400
  ) {
    super(message);
    this.name = 'SddError';
  }
}

// =============================================
// Security and Validation
// =============================================

class InputValidator {
  static validateProjectName(name: string): string {
    if (typeof name !== 'string') {
      throw new SddError('Project name must be a string', 'INVALID_TYPE');
    }
    
    if (name.length === 0 || name.length > 100) {
      throw new SddError('Project name must be 1-100 characters', 'INVALID_LENGTH');
    }
    
    if (!/^[a-zA-Z0-9\s\-_.]{1,100}$/.test(name)) {
      throw new SddError('Project name contains invalid characters', 'INVALID_FORMAT');
    }
    
    return name.trim();
  }

  static validateDescription(desc: string): string {
    if (typeof desc !== 'string') {
      throw new SddError('Description must be a string', 'INVALID_TYPE');
    }
    
    if (desc.length > config.security.maxInputLength) {
      throw new SddError(`Description too long (max ${config.security.maxInputLength} chars)`, 'DESCRIPTION_TOO_LONG');
    }
    
    return this.sanitizeHtml(desc);
  }

  static validateUserStory(story: string): string {
    if (typeof story !== 'string') {
      throw new SddError('User story must be a string', 'INVALID_TYPE');
    }
    
    if (story.length === 0 || story.length > 1000) {
      throw new SddError('User story must be 1-1000 characters', 'INVALID_LENGTH');
    }
    
    return this.sanitizeHtml(story);
  }

  static validateAcceptanceCriteria(criteria: string[]): string[] {
    if (!Array.isArray(criteria)) {
      throw new SddError('Acceptance criteria must be an array', 'INVALID_TYPE');
    }
    
    if (criteria.length === 0) {
      throw new SddError('At least one acceptance criterion is required', 'EMPTY_CRITERIA');
    }
    
    return criteria.map(criterion => {
      if (typeof criterion !== 'string') {
        throw new SddError('Each acceptance criterion must be a string', 'INVALID_TYPE');
      }
      
      if (criterion.length > 500) {
        throw new SddError('Acceptance criterion too long (max 500 chars)', 'CRITERION_TOO_LONG');
      }
      
      return this.sanitizeHtml(criterion);
    });
  }

  private static sanitizeHtml(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/\.\./g, '') // Prevent path traversal
      .trim();
  }
}

class SecureFileManager {
  static async writeSecurely(filePath: string, content: string): Promise<string> {
    // Validate and resolve path
    const resolvedPath = this.validateOutputPath(filePath);
    
    // Check content size
    if (Buffer.byteLength(content, 'utf8') > config.security.maxFileSize) {
      throw new SddError('Content too large', 'FILE_TOO_LARGE');
    }

    // Ensure directory exists
    await this.ensureDirectory(path.dirname(resolvedPath));
    
    // Write file with secure permissions
    await fs.writeFile(resolvedPath, content, { mode: 0o644 });
    
    return resolvedPath;
  }

  private static validateOutputPath(outputPath: string): string {
    const resolved = path.resolve(outputPath);
    
    // Check if path is within allowed directories
    const isAllowed = config.security.allowedDirs.some(allowedDir => {
      const allowedResolved = path.resolve(allowedDir);
      return resolved.startsWith(allowedResolved);
    });
    
    if (!isAllowed) {
      throw new SddError('Output path not allowed', 'INVALID_PATH');
    }
    
    // Check file extension
    const ext = path.extname(resolved);
    if (!config.security.allowedExtensions.includes(ext)) {
      throw new SddError(`File extension ${ext} not allowed`, 'INVALID_EXTENSION');
    }
    
    return resolved;
  }

  private static async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
      if ((error as any).code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

// =============================================
// Rate Limiting
// =============================================

class RateLimiter {
  private requests = new Map<string, number[]>();

  isAllowed(clientId: string = 'default', maxRequests = 100, windowMs = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const clientRequests = this.requests.get(clientId) || [];
    const validRequests = clientRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(clientId, validRequests);
    return true;
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [clientId, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > now - 300000); // 5 minutes
      if (validRequests.length === 0) {
        this.requests.delete(clientId);
      } else {
        this.requests.set(clientId, validRequests);
      }
    }
  }
}

// =============================================
// Type Guards
// =============================================

function isRequirementArgs(args: unknown): args is RequirementArgs {
  if (typeof args !== 'object' || args === null) return false;
  
  const obj = args as any;
  return (
    typeof obj.projectName === 'string' &&
    typeof obj.projectDescription === 'string' &&
    Array.isArray(obj.requirements) &&
    obj.requirements.every((req: any) =>
      typeof req.userStory === 'string' &&
      Array.isArray(req.acceptanceCriteria)
    ) &&
    (obj.outputPath === undefined || typeof obj.outputPath === 'string')
  );
}

function isDesignArgs(args: unknown): args is DesignArgs {
  if (typeof args !== 'object' || args === null) return false;
  
  const obj = args as any;
  return (
    typeof obj.projectName === 'string' &&
    typeof obj.projectDescription === 'string' &&
    typeof obj.techStack === 'object' &&
    obj.techStack !== null &&
    (obj.components === undefined || Array.isArray(obj.components)) &&
    (obj.dataModels === undefined || Array.isArray(obj.dataModels)) &&
    (obj.outputPath === undefined || typeof obj.outputPath === 'string')
  );
}

function isTasksArgs(args: unknown): args is TasksArgs {
  if (typeof args !== 'object' || args === null) return false;
  
  const obj = args as any;
  return (
    typeof obj.projectName === 'string' &&
    typeof obj.estimatedDuration === 'string' &&
    Array.isArray(obj.keyDeliverables) &&
    Array.isArray(obj.tasks) &&
    obj.tasks.every((task: any) =>
      typeof task.name === 'string' &&
      typeof task.description === 'string' &&
      Array.isArray(task.acceptanceCriteria) &&
      Array.isArray(task.dependencies) &&
      typeof task.estimate === 'string'
    ) &&
    (obj.outputPath === undefined || typeof obj.outputPath === 'string')
  );
}

// =============================================
// Document Generators
// =============================================

class RequirementsGenerator {
  static generate(args: RequirementArgs): string {
    const projectName = InputValidator.validateProjectName(args.projectName);
    const projectDescription = InputValidator.validateDescription(args.projectDescription);
    
    let content = `# Requirements Document

## Introduction
${projectDescription}

## Requirements

`;

    args.requirements.forEach((req, index) => {
      const userStory = InputValidator.validateUserStory(req.userStory);
      const acceptanceCriteria = InputValidator.validateAcceptanceCriteria(req.acceptanceCriteria);
      
      content += `### Requirement ${index + 1}

**User Story:** ${userStory}

#### Acceptance Criteria
${acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

`;
    });

    return content;
  }
}

class DesignGenerator {
  static generate(args: DesignArgs): string {
    const projectName = InputValidator.validateProjectName(args.projectName);
    const projectDescription = InputValidator.validateDescription(args.projectDescription);
    
    let content = `# Design Document

## Overview
${projectDescription}

## High-Level Architecture
System architecture diagram and explanation.

## Technology Stack
`;

    if (args.techStack.frontend) {
      const frontend = InputValidator.validateDescription(args.techStack.frontend);
      content += `- **Frontend**: ${frontend}\n`;
    }
    if (args.techStack.backend) {
      const backend = InputValidator.validateDescription(args.techStack.backend);
      content += `- **Backend**: ${backend}\n`;
    }
    if (args.techStack.database) {
      const database = InputValidator.validateDescription(args.techStack.database);
      content += `- **Database**: ${database}\n`;
    }
    if (args.techStack.infrastructure) {
      const infrastructure = InputValidator.validateDescription(args.techStack.infrastructure);
      content += `- **Infrastructure**: ${infrastructure}\n`;
    }

    content += `
## Components and Interfaces
`;

    if (args.components && args.components.length > 0) {
      const validatedComponents = args.components.map(comp => 
        InputValidator.validateDescription(comp)
      );
      content += validatedComponents.map(component => `- ${component}`).join('\n');
    } else {
      content += 'Description of main components and their interactions.';
    }

    content += `

## Data Models

### Core Types
`;

    if (args.dataModels && args.dataModels.length > 0) {
      const validatedModels = args.dataModels.map(model => 
        InputValidator.validateDescription(model)
      );
      content += validatedModels.map(model => `- ${model}`).join('\n');
    } else {
      content += 'Key data structures and their relationships.';
    }

    content += `

### API Contracts
Main endpoints and data flow.`;

    return content;
  }
}

class TasksGenerator {
  static generate(args: TasksArgs): string {
    const projectName = InputValidator.validateProjectName(args.projectName);
    const estimatedDuration = InputValidator.validateDescription(args.estimatedDuration);
    
    let content = `# Implementation Plan

## Overview
- **Project**: ${projectName}
- **Estimated Duration**: ${estimatedDuration}
- **Key Deliverables**: 
${args.keyDeliverables.map(deliverable => `  - ${InputValidator.validateDescription(deliverable)}`).join('\n')}

## Tasks

`;

    args.tasks.forEach((task, index) => {
      const name = InputValidator.validateDescription(task.name);
      const description = InputValidator.validateDescription(task.description);
      const acceptanceCriteria = InputValidator.validateAcceptanceCriteria(task.acceptanceCriteria);
      const dependencies = task.dependencies.map(dep => InputValidator.validateDescription(dep));
      const estimate = InputValidator.validateDescription(task.estimate);
      const requirementRef = task.requirementRef ? InputValidator.validateDescription(task.requirementRef) : undefined;
      
      content += `### Task ${index + 1}: ${name}
- [ ] **Description**: ${description}
- [ ] **Acceptance Criteria**: 
${acceptanceCriteria.map(criteria => `  - ${criteria}`).join('\n')}
- [ ] **Dependencies**: ${dependencies.join(', ') || 'None'}
- [ ] **Estimate**: ${estimate}
${requirementRef ? `- [ ] **Requirements Reference**: ${requirementRef}` : ''}

`;
    });

    content += `## Definition of Done
- [ ] Code implemented and tested
- [ ] All acceptance criteria met
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Ready for deployment

## Notes
Additional implementation notes or considerations.`;

    return content;
  }
}

// =============================================
// Main Server Class
// =============================================

class SddServer {
  private server: Server;
  private rateLimiter: RateLimiter;

  constructor() {
    this.server = new Server(
      {
        name: config.server.name,
        version: config.server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.rateLimiter = new RateLimiter();
    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });

    // Cleanup rate limiter periodically
    setInterval(() => this.rateLimiter.cleanup(), 300000); // 5 minutes
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_requirements',
          description: 'Generate a requirements document following the SDD template',
          inputSchema: {
            type: 'object',
            properties: {
              projectName: {
                type: 'string',
                description: 'Name of the project (1-100 characters, alphanumeric)',
                minLength: 1,
                maxLength: 100,
                pattern: '^[a-zA-Z0-9\\s\\-_.]+$',
              },
              projectDescription: {
                type: 'string',
                description: 'Brief description of the project',
                maxLength: config.security.maxInputLength,
              },
              requirements: {
                type: 'array',
                description: 'List of requirements',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    userStory: {
                      type: 'string',
                      description: 'User story for the requirement',
                      minLength: 1,
                      maxLength: 1000,
                    },
                    acceptanceCriteria: {
                      type: 'array',
                      description: 'List of acceptance criteria',
                      minItems: 1,
                      items: {
                        type: 'string',
                        maxLength: 500,
                      },
                    },
                  },
                  required: ['userStory', 'acceptanceCriteria'],
                  additionalProperties: false,
                },
              },
              outputPath: {
                type: 'string',
                description: 'Optional output path for the requirements document',
              },
            },
            required: ['projectName', 'projectDescription', 'requirements'],
            additionalProperties: false,
          },
        },
        {
          name: 'generate_design',
          description: 'Generate a design document following the SDD template',
          inputSchema: {
            type: 'object',
            properties: {
              projectName: {
                type: 'string',
                description: 'Name of the project',
                minLength: 1,
                maxLength: 100,
                pattern: '^[a-zA-Z0-9\\s\\-_.]+$',
              },
              projectDescription: {
                type: 'string',
                description: 'Brief description of the project',
                maxLength: config.security.maxInputLength,
              },
              techStack: {
                type: 'object',
                properties: {
                  frontend: { type: 'string', maxLength: 200 },
                  backend: { type: 'string', maxLength: 200 },
                  database: { type: 'string', maxLength: 200 },
                  infrastructure: { type: 'string', maxLength: 200 },
                },
                description: 'Technology stack for the project',
                additionalProperties: false,
              },
              components: {
                type: 'array',
                items: { type: 'string', maxLength: 200 },
                description: 'List of main components',
              },
              dataModels: {
                type: 'array',
                items: { type: 'string', maxLength: 200 },
                description: 'List of data models',
              },
              outputPath: {
                type: 'string',
                description: 'Optional output path for the design document',
              },
            },
            required: ['projectName', 'projectDescription', 'techStack'],
            additionalProperties: false,
          },
        },
        {
          name: 'generate_tasks',
          description: 'Generate an implementation plan (tasks) following the SDD template',
          inputSchema: {
            type: 'object',
            properties: {
              projectName: {
                type: 'string',
                description: 'Name of the project',
                minLength: 1,
                maxLength: 100,
                pattern: '^[a-zA-Z0-9\\s\\-_.]+$',
              },
              estimatedDuration: {
                type: 'string',
                description: 'Estimated project duration',
                maxLength: 100,
              },
              keyDeliverables: {
                type: 'array',
                items: { type: 'string', maxLength: 200 },
                description: 'List of key deliverables',
                minItems: 1,
              },
              tasks: {
                type: 'array',
                description: 'List of implementation tasks',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Task name', maxLength: 200 },
                    description: { type: 'string', description: 'Task description', maxLength: 1000 },
                    acceptanceCriteria: {
                      type: 'array',
                      items: { type: 'string', maxLength: 500 },
                      description: 'Task acceptance criteria',
                      minItems: 1,
                    },
                    dependencies: {
                      type: 'array',
                      items: { type: 'string', maxLength: 200 },
                      description: 'Task dependencies',
                    },
                    estimate: { type: 'string', description: 'Time estimate', maxLength: 100 },
                    requirementRef: {
                      type: 'string',
                      description: 'Reference to requirement (e.g., REQ-1)',
                      maxLength: 50,
                    },
                  },
                  required: ['name', 'description', 'acceptanceCriteria', 'dependencies', 'estimate'],
                  additionalProperties: false,
                },
              },
              outputPath: {
                type: 'string',
                description: 'Optional output path for the tasks document',
              },
            },
            required: ['projectName', 'estimatedDuration', 'keyDeliverables', 'tasks'],
            additionalProperties: false,
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        // Rate limiting check
        if (!this.rateLimiter.isAllowed()) {
          throw new SddError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429);
        }

        switch (request.params.name) {
          case 'generate_requirements':
            return await this.generateRequirements(request.params.arguments);
          case 'generate_design':
            return await this.generateDesign(request.params.arguments);
          case 'generate_tasks':
            return await this.generateTasks(request.params.arguments);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof SddError) {
          return {
            content: [
              {
                type: 'text',
                text: `${error.code}: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
        
        if (error instanceof McpError) {
          throw error; // Re-throw MCP errors
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async generateRequirements(args: unknown) {
    if (!isRequirementArgs(args)) {
      throw new SddError('Invalid arguments for generate_requirements', 'INVALID_ARGS');
    }

    const content = RequirementsGenerator.generate(args);
    const outputPath = await SecureFileManager.writeSecurely(
      args.outputPath || './requirements.md',
      content
    );

    return {
      content: [
        {
          type: 'text',
          text: `Requirements document generated successfully at: ${outputPath}`,
        },
      ],
    };
  }

  private async generateDesign(args: unknown) {
    if (!isDesignArgs(args)) {
      throw new SddError('Invalid arguments for generate_design', 'INVALID_ARGS');
    }

    const content = DesignGenerator.generate(args);
    const outputPath = await SecureFileManager.writeSecurely(
      args.outputPath || './design.md',
      content
    );

    return {
      content: [
        {
          type: 'text',
          text: `Design document generated successfully at: ${outputPath}`,
        },
      ],
    };
  }

  private async generateTasks(args: unknown) {
    if (!isTasksArgs(args)) {
      throw new SddError('Invalid arguments for generate_tasks', 'INVALID_ARGS');
    }

    const content = TasksGenerator.generate(args);
    const outputPath = await SecureFileManager.writeSecurely(
      args.outputPath || './tasks.md',
      content
    );

    return {
      content: [
        {
          type: 'text',
          text: `Tasks document generated successfully at: ${outputPath}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SDD MCP server running on stdio');
  }
}

const server = new SddServer();
server.run().catch(console.error);
