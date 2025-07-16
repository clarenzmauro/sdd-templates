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

This project includes a lightweight Model Context Protocol (MCP) server that provides AI assistants with comprehensive guidance on the Spec Driven Development (SDD) process and instructs them to create SDD documentation files.

### Features

- **SDD Process Guidance** - Provides comprehensive instructions on the SDD methodology
- **AI Instructions** - Tells AI assistants how to create `.sdd/` directory and generate SDD files
- **Template Guidance** - Guides creation of requirements, design, and task documents using exact template formats
- **Human-in-the-Loop Process** - Enforces mandatory approval phases between each step
- **Context7 Integration** - Leverages latest documentation when available for technology recommendations
- **Docker Support** - Containerized deployment for easy integration
- **Lightweight** - Simple, focused implementation without complex file handling

### Available Tools

#### `sdd_guide`
Provides comprehensive guidance on the Spec Driven Development process and instructs AI assistants on how to create SDD documentation.

**Parameters:**
- `query` (string): User query or project description to guide the SDD process (1-1000 characters)

**What it does:**
- Explains the SDD methodology (Requirements → Design → Tasks → Implementation)
- Instructs the AI to create a `.sdd/` directory (and add it to `.gitignore`)
- Guides creation of three core files using exact template formats:
  - `requirements.md` - User stories and acceptance criteria
  - `design.md` - System architecture and tech stack
  - `tasks.md` - Implementation plan with tasks and estimates
- Enforces a mandatory phase-by-phase approval process
- Integrates with Context7 MCP server for latest documentation when available

## Installation

### Prerequisites
- **Node.js 18+** (for local installation)
- **Docker** (for containerized deployment)
- **Git** (to clone the repository)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/clarenzmauro/sdd-templates.git
cd sdd-templates/sdd-server
```

2. **Choose your installation method:**

**Option A: Docker (Recommended)**
```bash
# Build the Docker image
docker build -t sdd-server:latest .

# Start the persistent container
docker-compose up -d
```

**Option B: Local Installation**
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

3. **Verify installation:**
```bash
# Test with Docker
docker run --rm sdd-server:latest --help

# Or test locally
node build/index.js --help
```

### Adding to Cline MCP Servers

#### Quick Setup (Recommended)

After building the Docker image, add the SDD server to Cline:

1. **Open Cline Settings**
   - In VS Code, open Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
   - Type "Cline: Open MCP Settings"
   - Or manually open: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

2. **Start the persistent container:**
   ```bash
   cd /path/to/your/sdd-server
   docker-compose up -d
   ```

3. **Add SDD Server Configuration (Docker Compose - Recommended):**
   ```json
   {
     "mcpServers": {
       "sdd-server": {
         "command": "docker-compose",
         "args": [
           "-f", "/path/to/your/sdd-server/docker-compose.yml",
           "exec", "sdd-server", "node", "build/index.js"
         ],
         "disabled": false,
         "autoApprove": [
           "sdd_guide"
         ]
       }
     }
   }
   ```
   **Important**: Replace `/path/to/your/sdd-server/` with the actual path to your cloned repository.

4. **Alternative configurations:**

   **Direct Docker Command:**
   ```json
   {
     "mcpServers": {
       "sdd-server": {
         "command": "docker",
         "args": [
           "run", "--rm", "-i",
           "-v", "${PWD}:/workspace",
           "sdd-server:latest"
         ],
         "disabled": false,
         "autoApprove": [
           "sdd_guide"
         ]
       }
     }
   }
   ```

   **Local Development:**
   ```json
   {
     "mcpServers": {
       "sdd-server": {
         "command": "node",
         "args": ["/path/to/your/sdd-server/build/index.js"],
         "disabled": false,
         "autoApprove": [
           "sdd_guide"
         ]
       }
     }
   }
   ```

#### Verifying the Setup

1. **Restart Cline** after updating the MCP settings
2. **Check Server Status** - You should see "sdd-server" listed in Cline's MCP servers
3. **Test Connection** - Try using the SDD guide tool in Cline

**Remember**: For Docker Compose setup, you must run `docker-compose up -d` first to start the persistent container!

## Usage Example

Here's how to use SDD in practice:

### Using the SDD Guide Tool

Simply ask the AI: "I want to build a task management application for teams"

The AI will use the `sdd_guide` tool automatically and provide comprehensive guidance on implementing the SDD process for your specific project.

### The SDD Process Flow

#### Phase 1: Setup and Requirements
1. **Directory Creation**: AI creates `.sdd/` directory and adds it to `.gitignore`
2. **Requirements Generation**: AI creates `requirements.md` using exact template format:
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
3. **Mandatory Approval**: AI waits for your approval before proceeding

#### Phase 2: Design (Only after Phase 1 approval)
1. **Context7 Integration**: If available, AI fetches latest documentation for recommended technologies
2. **Design Generation**: AI creates `design.md` with current best practices:
   ```markdown
   # Design Document

   ## Technology Stack
   - **Frontend**: React with TypeScript
   - **Backend**: Node.js with Express
   - **Database**: PostgreSQL
   - **Infrastructure**: Docker containers
   ```
3. **Mandatory Approval**: AI waits for your approval before proceeding

#### Phase 3: Implementation Planning (Only after Phase 2 approval)
1. **Task Breakdown**: AI creates `tasks.md` with detailed implementation plan:
   ```markdown
   # Implementation Plan

   ## Tasks

   ### Task 1: Database Schema Setup
   - [ ] **Description**: Create PostgreSQL schema for users, teams, and tasks
   - [ ] **Acceptance Criteria**: 
     - All tables created with proper relationships
     - Indexes added for performance
   - [ ] **Dependencies**: None
   - [ ] **Requirements Reference**: REQ-1
   ```
2. **Final Approval**: AI waits for your approval before implementation

### Key Features

- **Human-in-the-Loop**: Mandatory approval between each phase ensures you stay in control
- **Latest Documentation**: Context7 integration provides current best practices and API references
- **Exact Templates**: Consistent document structure across all projects
- **Local `.sdd/` Directory**: All planning documents stay local and are not committed to version control

## The `.sdd/` Directory Approach

The SDD process uses a local `.sdd/` directory to store all planning documents:

- **Local Only**: All SDD files remain on your local machine
- **Git Ignored**: Automatically added to `.gitignore` to prevent accidental commits
- **Organized Structure**: Clean separation between planning docs and project code
- **Secure**: No sensitive planning information is committed to version control

### Directory Structure
```
your-project/
├── .sdd/                    # Local planning documents (git ignored)
│   ├── requirements.md      # User stories and acceptance criteria
│   ├── design.md           # System architecture and tech stack
│   └── tasks.md            # Implementation plan
├── .gitignore              # Contains .sdd/ entry
└── [your project files]    # Actual implementation
```

## Configuration

The server supports basic configuration through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_NAME` | Server identification name | sdd-server |
| `SERVER_VERSION` | Server version | 0.1.0 |

Example configuration:
```bash
SERVER_NAME=my-sdd-server
SERVER_VERSION=0.1.0
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
cd sdd-server
npm run build

# Run in development mode
npm run watch

# Run with MCP inspector for debugging
npm run inspector

# Docker development
npm run docker:build      # Build Docker image
npm run docker:run        # Run container
npm run docker:compose    # Start with Docker Compose
```

### Troubleshooting

#### Common Issues

1. **Server Not Starting**
   - Ensure Node.js 18+ is installed
   - Check that all dependencies are installed: `npm install`
   - Verify the build completed successfully: `npm run build`

2. **Docker Issues**
   - Ensure Docker is running: `docker ps`
   - Check if the image was built: `docker images sdd-server`
   - Restart the container: `docker-compose restart`

3. **MCP Integration Issues**
   - Ensure JSON syntax is valid in MCP settings
   - Restart VS Code/Cline completely after configuration changes
   - Check Cline's output panel for error messages
   - For Docker Compose setup, ensure the container is running: `docker-compose ps`

#### Debug Mode
Use the MCP Inspector for debugging:
```bash
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
