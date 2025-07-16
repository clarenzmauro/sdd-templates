# SDD MCP Server

A secure Model Context Protocol (MCP) server that simplifies Spec Driven Development (SDD) by automating the generation of requirements, design, and task documents.

## Features

- 🔒 **Enterprise Security**: Input sanitization, path validation, rate limiting, and file size controls
- 📝 **Requirements Generation**: Create structured requirements documents with user stories and acceptance criteria
- 🏗️ **Design Documentation**: Generate comprehensive design documents with tech stack and architecture details
- ✅ **Task Planning**: Produce detailed implementation plans with tasks, dependencies, and estimates
- 🐳 **Docker Support**: Containerized deployment with security hardening
- ⚡ **High Performance**: Optimized for production use with configurable limits

## Security Features

- **Input Sanitization**: Prevents XSS and script injection attacks
- **Path Traversal Protection**: Restricts file access to allowed directories only
- **Rate Limiting**: Prevents abuse with configurable request limits (100/minute default)
- **File Size Limits**: Configurable content size restrictions (1MB default)
- **Type Safety**: Comprehensive runtime validation with TypeScript
- **Error Handling**: Specific error codes with proper HTTP status mapping

## Installation

### Quick Start (General Instructions)

Follow these steps to install and set up the SDD MCP Server:

#### Step 1: Prerequisites
- **Node.js 18+** (for local installation)
- **Docker** (for containerized deployment)
- **Git** (to clone the repository)

#### Step 2: Clone the Repository
```bash
git clone https://github.com/clarenzmauro/sdd-templates.git
cd sdd-templates/sdd-server
```

#### Step 3: Choose Your Installation Method

**Option A: Docker (Recommended)**
```bash
# Build the Docker image
docker build -t sdd-server:latest .

# Or use Docker Compose
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

#### Step 4: Verify Installation
```bash
# Test with Docker
docker run --rm sdd-server:latest --help

# Or test locally
node build/index.js --help
```

### Detailed Installation Options

#### NPM Installation (Future Release)
```bash
npm install -g sdd-server
```

#### From Source
```bash
git clone https://github.com/clarenzmauro/sdd-templates.git
cd sdd-templates/sdd-server
npm install
npm run build
```

#### Docker Installation
```bash
# Build from source
git clone https://github.com/clarenzmauro/sdd-templates.git
cd sdd-templates/sdd-server
docker build -t sdd-server:latest .

# Or pull from registry (when available)
docker pull sdd-server:latest
```

## Usage

### Command Line
```bash
# Start the server
npm start

# Start with MCP Inspector for debugging
npm run inspector
```

### Docker
```bash
# Run with Docker
docker run --rm -i sdd-server:latest

# Run with Docker Compose
docker-compose up -d
```

## Adding to Cline MCP Servers

### Quick Setup (Recommended)

Since you already have the server running via Docker Compose, here's how to add it to Cline:

1. **Open Cline Settings**
   - In VS Code, open Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
   - Type "Cline: Open MCP Settings"
   - Or manually open: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

2. **Add SDD Server Configuration**
   ```json
   {
     "mcpServers": {
       "sdd-server": {
         "command": "docker",
         "args": [
           "run", "--rm", "-i",
           "sdd-server:latest"
         ],
         "env": {
           "MAX_FILE_SIZE": "1048576",
           "MAX_INPUT_LENGTH": "10000"
         }
       }
     }
   }
   ```

3. **Alternative: Use Docker Compose**
   ```json
   {
     "mcpServers": {
       "sdd-server": {
         "command": "docker-compose",
         "args": [
           "-f", "/path/to/your/sdd-server/docker-compose.yml",
           "run", "--rm", "sdd-server"
         ],
         "cwd": "/path/to/your/sdd-server"
       }
     }
   }
   ```

4. **For Local Development (if built locally)**
   ```json
   {
     "mcpServers": {
       "sdd-server": {
         "command": "node",
         "args": ["/path/to/your/sdd-server/build/index.js"],
         "env": {
           "MAX_FILE_SIZE": "1048576",
           "MAX_INPUT_LENGTH": "10000"
         }
       }
     }
   }
   ```

### Configuration Options

You can customize the server behavior by setting environment variables:

```json
{
  "mcpServers": {
    "sdd-server": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "sdd-server:latest"],
      "env": {
        "MAX_FILE_SIZE": "2097152",         // 2MB limit
        "MAX_INPUT_LENGTH": "20000",        // 20K character limit
        "SERVER_NAME": "my-sdd-server",     // Custom server name
        "SERVER_VERSION": "0.1.0"          // Version identifier
      }
    }
  }
}
```

### Verifying the Setup

1. **Restart Cline** after updating the MCP settings
2. **Check Server Status** - You should see "sdd-server" listed in Cline's MCP servers
3. **Test Connection** - Try using one of the SDD tools:
   - `generate_requirements`
   - `generate_design` 
   - `generate_tasks`

### Troubleshooting MCP Integration

#### Server Not Appearing
- Ensure the JSON syntax is valid in your MCP settings
- Check that the Docker image exists: `docker images sdd-server`
- Restart VS Code/Cline completely

#### Connection Errors
- Verify Docker is running: `docker ps`
- Test the server manually: `docker run --rm -i sdd-server:latest`
- Check Cline's output panel for error messages

#### Permission Issues
- Ensure Docker has proper permissions
- On Linux/Mac, you might need to add your user to the docker group

### Example Usage in Cline

Once configured, you can use the SDD server directly in Cline:

```
Generate requirements for a todo application with the following user stories:
- As a user, I want to add tasks
- As a user, I want to mark tasks as complete
- As a user, I want to delete tasks
```

Cline will automatically use the `generate_requirements` tool to create a structured requirements document.

### Environment Variables

Configure the server using environment variables:

```bash
# Server configuration
SERVER_NAME=sdd-server
SERVER_VERSION=0.1.0

# Security settings
MAX_FILE_SIZE=1048576          # Maximum file size in bytes (default: 1MB)
MAX_INPUT_LENGTH=10000         # Maximum input length (default: 10,000 chars)
```

## MCP Tools

The server provides three main tools:

### 1. Generate Requirements (`generate_requirements`)

Creates a structured requirements document with user stories and acceptance criteria.

**Parameters:**
- `projectName` (string): Name of the project (1-100 characters)
- `projectDescription` (string): Brief project description
- `requirements` (array): List of requirements with user stories and acceptance criteria
- `outputPath` (string, optional): Output file path (defaults to `./requirements.md`)

**Example:**
```json
{
  "projectName": "Todo App",
  "projectDescription": "A simple task management application",
  "requirements": [
    {
      "userStory": "As a user, I want to add new tasks",
      "acceptanceCriteria": [
        "User can enter task description",
        "Task is saved to the system",
        "User receives confirmation"
      ]
    }
  ]
}
```

### 2. Generate Design (`generate_design`)

Creates a comprehensive design document with architecture and technical details.

**Parameters:**
- `projectName` (string): Name of the project
- `projectDescription` (string): Brief project description
- `techStack` (object): Technology stack details (frontend, backend, database, infrastructure)
- `components` (array, optional): List of main components
- `dataModels` (array, optional): List of data models
- `outputPath` (string, optional): Output file path (defaults to `./design.md`)

**Example:**
```json
{
  "projectName": "Todo App",
  "projectDescription": "A simple task management application",
  "techStack": {
    "frontend": "React with TypeScript",
    "backend": "Node.js with Express",
    "database": "PostgreSQL",
    "infrastructure": "AWS with Docker"
  },
  "components": ["TaskList", "TaskForm", "TaskItem"],
  "dataModels": ["Task", "User", "Category"]
}
```

### 3. Generate Tasks (`generate_tasks`)

Produces detailed implementation plans with tasks, dependencies, and estimates.

**Parameters:**
- `projectName` (string): Name of the project
- `estimatedDuration` (string): Project duration estimate
- `keyDeliverables` (array): List of key deliverables
- `tasks` (array): Implementation tasks with details
- `outputPath` (string, optional): Output file path (defaults to `./tasks.md`)

**Example:**
```json
{
  "projectName": "Todo App",
  "estimatedDuration": "4 weeks",
  "keyDeliverables": ["Web Application", "API", "Database"],
  "tasks": [
    {
      "name": "Setup Development Environment",
      "description": "Initialize project structure and dependencies",
      "acceptanceCriteria": [
        "Project structure created",
        "Dependencies installed",
        "Development server running"
      ],
      "dependencies": [],
      "estimate": "1 day",
      "requirementRef": "REQ-1"
    }
  ]
}
```

## Security Considerations

### Input Validation
- All inputs are validated for type, length, and format
- HTML content is sanitized to prevent XSS attacks
- Path traversal attempts are blocked

### File System Security
- Output paths are restricted to allowed directories: `./output`, `./temp`, `./`
- Only `.md` and `.txt` file extensions are permitted
- File sizes are limited to prevent resource exhaustion

### Rate Limiting
- 100 requests per minute per client (configurable)
- Automatic cleanup of old rate limit entries
- Per-client tracking with sliding window algorithm

### Error Handling
- Specific error codes for different failure types
- No sensitive information leaked in error messages
- Proper HTTP status code mapping

## Development

### Project Structure
```
sdd-server/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript output
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile           # Docker container definition
├── package.json         # NPM package configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

### Building
```bash
npm run build         # Compile TypeScript
npm run watch         # Watch mode for development
```

### Docker Development
```bash
npm run docker:build    # Build Docker image
npm run docker:run      # Run container
npm run docker:compose  # Start with Docker Compose
```

## Configuration

### Security Settings
The server supports various security configurations through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MAX_FILE_SIZE` | Maximum file size in bytes | 1048576 (1MB) |
| `MAX_INPUT_LENGTH` | Maximum input string length | 10000 |
| `SERVER_NAME` | Server identification name | sdd-server |
| `SERVER_VERSION` | Server version | 0.1.0 |

### File Permissions
Generated files are created with secure permissions (644) and in restricted directories only.

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure output directories exist and are writable
   - Check file permissions and ownership

2. **Rate Limit Exceeded**
   - Wait for the rate limit window to reset (1 minute)
   - Configure higher limits via environment variables if needed

3. **Invalid Path Errors**
   - Ensure output paths are within allowed directories
   - Use relative paths starting with `./`

4. **File Size Errors**
   - Reduce content size or increase `MAX_FILE_SIZE` limit
   - Check available disk space

### Debug Mode
Use the MCP Inspector for debugging:
```bash
npm run inspector
```

## Contributing

This is a production-ready MCP server with enterprise-grade security features. For issues or feature requests, please refer to the project documentation.

## License

MIT License - see package.json for details.

## Security

This server implements comprehensive security measures:
- All inputs are validated and sanitized
- File system access is restricted and monitored
- Rate limiting prevents abuse
- Error handling prevents information disclosure

For security-related questions or to report vulnerabilities, please contact the development team.
