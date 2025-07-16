# Spec Driven Development (SDD)

A structured approach to software development that emphasizes specification-first development through a systematic process of requirements gathering, design planning, and task breakdown.

## What is Spec Driven Development?

Spec Driven Development (SDD) is a methodology that prioritizes thorough planning and documentation before implementation. It ensures that all stakeholders have a clear understanding of what needs to be built, how it will be built, and what constitutes success.

The SDD process follows a sequential workflow:

1. **Requirements Analysis** - Define what the system should do
2. **Design Planning** - Determine how the system will be built
3. **Task Breakdown** - Create actionable implementation steps
4. **Iterative Implementation** - Execute tasks with quality focus

## The SDD Process

### 1. Requirements Generation
The AI assists in creating comprehensive requirements documents based on user input. This includes:
- User stories that describe functionality from the end-user perspective
- Acceptance criteria that define when a feature is considered complete
- Clear, measurable specifications

### 2. Design Document Creation
Based on the requirements, the AI generates detailed design documents covering:
- System architecture and high-level overview
- Technology stack selection
- Component breakdown and interfaces
- Data models and API contracts

### 3. Implementation Planning
The AI creates actionable task lists that include:
- Detailed task descriptions with acceptance criteria
- Dependencies between tasks
- Time estimates for planning
- References back to original requirements

### 4. Quality Implementation
Tasks are executed one at a time with focus on:
- Meeting all acceptance criteria
- Code review and testing
- Documentation updates
- Iterative refinement

## MCP Server

This project includes a Model Context Protocol (MCP) server that provides AI assistants with tools to generate SDD documents automatically.

### Features

- **Secure Document Generation** - Input validation and sanitization
- **Template-Based Output** - Consistent document structure
- **Rate Limiting** - Prevents abuse and ensures stability
- **Error Handling** - Comprehensive validation and error reporting
- **Docker Support** - Easy deployment and scaling

### Available Tools

#### `generate_requirements`
Generates a requirements document with:
- Project introduction and description
- User stories with acceptance criteria
- Structured requirement numbering

#### `generate_design`
Creates design documents including:
- System overview and architecture
- Technology stack specifications
- Component and data model definitions
- API contract outlines

#### `generate_tasks`
Produces implementation plans with:
- Project timeline and deliverables
- Detailed task breakdowns
- Dependencies and estimates
- Definition of done criteria

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/clarenzmauro/sdd-templates.git
cd sdd-templates
```

2. Install MCP server dependencies:
```bash
cd sdd-server
npm install
```

3. Build the server:
```bash
npm run build
```

4. Run the server:
```bash
npm start
```

### Docker Deployment

1. Build the Docker image:
```bash
cd sdd-server
npm run docker:build
```

2. Run with Docker Compose:
```bash
npm run docker:compose
```

### MCP Configuration

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "sdd-server": {
      "command": "node",
      "args": ["/path/to/sdd-server/build/index.js"],
      "env": {
        "SERVER_NAME": "sdd-server",
        "SERVER_VERSION": "0.1.0"
      }
    }
  }
}
```

## Usage Example

Here's how to use SDD in practice:

### Step 1: Requirements
Ask the AI: "I want to build a task management application for teams"

The AI uses the `generate_requirements` tool to create:
```markdown
# Requirements Document

## Introduction
A collaborative task management application that enables teams to organize, track, and complete work efficiently.

## Requirements

### Requirement 1
**User Story:** As a team member, I want to create tasks so that I can track work that needs to be done.

#### Acceptance Criteria
- Users can create tasks with title, description, and due date
- Tasks are automatically assigned a unique ID
- Created tasks appear in the team's task list
```

### Step 2: Design
AI generates design based on requirements:
```markdown
# Design Document

## Technology Stack
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Infrastructure**: Docker containers
```

### Step 3: Tasks
AI creates implementation plan:
```markdown
# Implementation Plan

## Tasks

### Task 1: Database Schema Setup
- [ ] **Description**: Create PostgreSQL schema for users, teams, and tasks
- [ ] **Acceptance Criteria**: 
  - All tables created with proper relationships
  - Indexes added for performance
- [ ] **Estimate**: 4 hours
```

### Step 4: Implementation
Execute tasks one by one, ensuring each meets acceptance criteria before moving to the next.

## Security Features

The MCP server includes several security measures:

- **Input Validation** - All inputs are validated and sanitized
- **File System Security** - Restricted file operations to allowed directories
- **Rate Limiting** - Prevents abuse with configurable limits
- **Content Size Limits** - Prevents resource exhaustion
- **Path Traversal Protection** - Blocks dangerous file operations

## Configuration

Environment variables for customization:

```bash
SERVER_NAME=sdd-server
SERVER_VERSION=0.1.0
MAX_FILE_SIZE=1048576  # 1MB
MAX_INPUT_LENGTH=10000
```

## Development

### Project Structure
```
sdd-templates/
├── README.md                    # This file
├── requirements.md              # Example requirements template
├── design.md                    # Example design template  
├── tasks.md                     # Example tasks template
└── sdd-server/                  # MCP server implementation
    ├── src/index.ts             # Main server code
    ├── package.json             # Dependencies
    ├── Dockerfile               # Container setup
    └── docker-compose.yml       # Service orchestration
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Building and Testing

```bash
# Build the server
npm run build

# Run in development mode
npm run watch

# Run with MCP inspector for debugging
npm run inspector
```

## Benefits of SDD

- **Clarity** - Everyone understands what's being built
- **Quality** - Systematic approach reduces bugs and rework
- **Efficiency** - Proper planning saves time during implementation
- **Maintainability** - Good documentation aids future development
- **Communication** - Clear specs improve team collaboration

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions:
- Open an issue on GitHub
