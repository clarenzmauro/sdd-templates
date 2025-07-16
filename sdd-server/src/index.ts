#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// =============================================
// Configuration
// =============================================

const config = {
  server: {
    name: process.env.SERVER_NAME || "sdd-server",
    version: process.env.SERVER_VERSION || "0.1.0",
  },
};

interface SddGuideArgs {
  query: string;
}

// =============================================
// Type Guards
// =============================================

function isSddGuideArgs(args: unknown): args is SddGuideArgs {
  if (typeof args !== "object" || args === null) return false;
  const obj = args as any;
  return typeof obj.query === "string";
}

// =============================================
// SDD Process Guide
// =============================================

class SddGuide {
  static generateGuidance(query: string): string {
    return `Based on your query: "${query}"

I will help you follow the Spec Driven Development (SDD) process. Here's what you need to do:

## Understanding Spec Driven Development (SDD)

SDD is a structured approach to software development that emphasizes specification-first development through a systematic process:

1. **Requirements Analysis** - Define what the system should do
2. **Design Planning** - Determine how the system will be built  
3. **Task Breakdown** - Create actionable implementation steps
4. **Iterative Implementation** - Execute tasks with quality focus

## Step 1: Create the .sdd Directory

First, I need to create a directory named ".sdd/" in your project to contain all the SDD files:

\`\`\`bash
mkdir -p .sdd
\`\`\`

**CRITICAL: Add .sdd to .gitignore**

After creating the .sdd directory, I MUST immediately add the .sdd directory to .gitignore to prevent SDD files from being committed to version control:

\`\`\`bash
echo ".sdd/" >> .gitignore
\`\`\`

If .gitignore doesn't exist, I will create it first:

\`\`\`bash
touch .gitignore
echo ".sdd/" >> .gitignore
\`\`\`

**IMPORTANT:** The .sdd directory and its contents should NEVER be committed to the repository as these are working documents that may contain sensitive planning information and should remain local to the development environment.

## Step 2: Generate SDD Files Using EXACT Template Formats

**🚨 MANDATORY HUMAN-IN-THE-LOOP PROCESS 🚨**

I will generate files in THREE DISTINCT PHASES with MANDATORY human approval between each phase. I MUST NOT proceed to the next phase without explicit human approval.

I will now generate the following files in sequence using the EXACT template formats specified below:

### 2.1 Requirements Document (.sdd/requirements.md)

**CRITICAL: Use this EXACT template format:**

\`\`\`markdown
# Requirements Document

## Introduction

## Requirements

### Requirement 1

**User Story:** 

#### Acceptance Criteria

### Requirement 2

**User Story:** 

#### Acceptance Criteria

### Requirement 3

**User Story:** 

#### Acceptance Criteria
\`\`\`

### 2.2 Design Document (.sdd/design.md)

**CRITICAL: Use this EXACT template format:**

\`\`\`markdown
# Design Document

## Overview
Brief description of the system and its purpose.

## High-Level Architecture
System architecture diagram and explanation.

## Technology Stack
- **Frontend**: 
- **Backend**: 
- **Database**: 
- **Infrastructure**: 

## Components and Interfaces
Description of main components and their interactions.

## Data Models

### Core Types
Key data structures and their relationships.

### API Contracts
Main endpoints and data flow.
\`\`\`

### 2.3 Implementation Plan (.sdd/tasks.md)

**CRITICAL: Use this EXACT template format:**

\`\`\`markdown
# Implementation Plan

## Overview
- **Project**: 
- **Key Deliverables**: 

## Tasks

### Task 1: [Component/Feature Name]
- [ ] **Description**: 
- [ ] **Acceptance Criteria**: 
- [ ] **Dependencies**: 
- [ ] **Requirements Reference**: REQ-

### Task 2: [Component/Feature Name]
- [ ] **Description**: 
- [ ] **Acceptance Criteria**: 
- [ ] **Dependencies**: 
- [ ] **Requirements Reference**: REQ-

### Task 3: [Component/Feature Name]
- [ ] **Description**: 
- [ ] **Acceptance Criteria**: 
- [ ] **Dependencies**: 
- [ ] **Requirements Reference**: REQ-

## Definition of Done
- [ ] Code implemented and tested
- [ ] All acceptance criteria met
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Ready for deployment

## Notes
Additional implementation notes or considerations.
\`\`\`

## STRICT FORMATTING REQUIREMENTS

**ABSOLUTELY CRITICAL:** You MUST use the exact template formats shown above. Do not deviate from:
- Section headings and hierarchy
- Markdown formatting
- Bullet point structures  
- Checkbox formats
- Field placeholders
- Overall document structure

## Implementation Process

After generating these documents using the EXACT formats above:

1. **Review and refine** each document to ensure completeness
2. **Execute tasks one by one** with focus on:
   - Meeting all acceptance criteria
   - Code review and testing
   - Documentation updates
   - Iterative refinement

## Next Steps

# 🚨 CRITICAL: MANDATORY HUMAN-IN-THE-LOOP PROCESS 🚨

**ABSOLUTELY REQUIRED:** I MUST proceed through the SDD process one phase at a time with MANDATORY human approval between each phase. I am FORBIDDEN from generating multiple files without explicit approval.

## PHASE-BY-PHASE EXECUTION WITH MANDATORY APPROVALS

### 🔹 Phase 1: Setup and Requirements Generation
1. **FIRST**: Create the .sdd directory using: \`mkdir -p .sdd\`
2. **IMMEDIATELY AFTER**: Add .sdd to .gitignore (create .gitignore if it doesn't exist):
   - If .gitignore exists: \`echo ".sdd/" >> .gitignore\`
   - If .gitignore doesn't exist: \`touch .gitignore && echo ".sdd/" >> .gitignore\`
3. **CRITICAL**: Verify .sdd is added to .gitignore BEFORE proceeding
4. Generate requirements.md using the EXACT template format shown above
5. **🛑 MANDATORY STOP: Ask human to review requirements.md**
6. **⏸️ WAIT: Do not proceed until receiving explicit human approval**
7. **❌ FORBIDDEN: Do not generate design.md until Phase 1 is approved**

### 🔹 Phase 2: Design Generation (ONLY after explicit Phase 1 approval)
1. **✅ PREREQUISITE: Confirm Phase 1 approval received**
2. **Check for Context7 MCP server availability** - Before generating design.md, check if the Context7 MCP server is connected and available by looking for the "github.com/upstash/context7-mcp" server in the available MCP servers
3. **If Context7 is available:** 
   - Use the "resolve-library-id" tool to find Context7-compatible library IDs for any technologies, frameworks, or libraries mentioned in the requirements
   - Use the "get-library-docs" tool to fetch the latest documentation for each identified technology
   - Focus on retrieving documentation that covers: architecture patterns, best practices, API specifications, configuration options, and integration guidelines
   - Incorporate these insights into the design to ensure it reflects current standards and recommended approaches
4. **If Context7 is not available:** Proceed with design.md generation using general best practices knowledge
5. Generate design.md using the EXACT template format shown above, incorporating insights from the latest documentation when available
6. **🛑 MANDATORY STOP: Ask human to review design.md**
7. **⏸️ WAIT: Do not proceed until receiving explicit human approval**
8. **❌ FORBIDDEN: Do not generate tasks.md until Phase 2 is approved**

### 🔹 Phase 3: Implementation Planning (ONLY after explicit Phase 2 approval)
1. **✅ PREREQUISITE: Confirm Phase 2 approval received**
2. Generate tasks.md using the EXACT template format shown above
3. **🛑 MANDATORY STOP: Ask human to review tasks.md**
4. **⏸️ WAIT: Do not proceed until receiving explicit human approval**
5. **❌ FORBIDDEN: Do not begin implementation until Phase 3 is approved**

## 🚨 CRITICAL INSTRUCTIONS FOR AI EXECUTION 🚨

**ABSOLUTE REQUIREMENTS:**
- ❌ **NEVER generate all files at once**
- ❌ **NEVER skip human approval phases**
- ❌ **NEVER proceed to next phase without explicit approval**
- ✅ **ALWAYS complete ONE phase completely before asking for approval**
- ✅ **ALWAYS ask explicitly: "I have completed [Phase Name]. Please review the [document name] document. Do you approve this phase so I can proceed to [Next Phase], or would you like me to make changes first?"**
- ✅ **ALWAYS wait for explicit human response before proceeding**
- ✅ **ALWAYS allow human to request modifications before moving forward**

**ENFORCEMENT:** If AI attempts to generate multiple documents without approval, this violates the SDD human-in-the-loop requirement and must be immediately corrected.

Each file MUST follow the exact template structures provided - no variations or creative interpretations allowed.`;
  }
}

// =============================================
// Main Server Class
// =============================================

class SddServer {
  private server: Server;

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

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "sdd_guide",
          description:
            "Provides guidance on the Spec Driven Development (SDD) process and instructs the AI to create .sdd directory and generate SDD files",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "User query or project description to guide the SDD process",
                minLength: 1,
                maxLength: 1000,
              },
            },
            required: ["query"],
            additionalProperties: false,
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case "sdd_guide":
            return await this.provideSddGuidance(request.params.arguments);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async provideSddGuidance(args: unknown) {
    if (!isSddGuideArgs(args)) {
      throw new Error(
        "Invalid arguments for sdd_guide. Expected: { query: string }"
      );
    }

    const guidance = SddGuide.generateGuidance(args.query);

    return {
      content: [
        {
          type: "text",
          text: guidance,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("SDD MCP server running on stdio");
  }
}

const server = new SddServer();
server.run().catch(console.error);
