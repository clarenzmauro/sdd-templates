# SDD MCP Server

A lightweight Model Context Protocol (MCP) server that provides guidance on Spec Driven Development (SDD) process and instructs AI assistants to create SDD documentation files.

## Features

- 📋 **SDD Process Guidance**: Provides comprehensive instructions on the Spec Driven Development methodology
- 🤖 **AI Instructions**: Tells AI assistants how to create .sdd directory and generate SDD files
- 📝 **Template Guidance**: Guides creation of requirements, design, and task documents
- 🐳 **Docker Support**: Containerized deployment for easy integration
- ⚡ **Lightweight**: Simple, focused implementation without complex file handling

## What This Server Does

This server provides a single tool called `sdd_guide` that:
- Explains the SDD process to AI assistants
- Instructs them to create a `.sdd/` directory
- Guides them to generate the three core SDD files:
  - `requirements.md` - User stories and acceptance criteria
  - `design.md` - System architecture and tech stack
  - `tasks.md` - Implementation plan with tasks and estimates

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

After building the Docker image, here's how to add the SDD server to Cline:

1. **Open Cline Settings**
   - In VS Code, open Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
   - Type "Cline: Open MCP Settings"
   - Or manually open: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

2. **Start the Persistent Container**
   ```bash
   cd /path/to/your/sdd-server
   docker-compose up -d
   ```

3. **Add SDD Server Configuration (Docker Compose - Recommended)**
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

4. **Alternative: Direct Docker Command**
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

5. **For Local Development (if built locally)**
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

### Complete Setup Example

For a typical installation, your complete MCP settings file should look like this:
```json
{
  "mcpServers": {
    "sdd-server": {
      "command": "docker-compose",
      "args": [
        "-f", "/Users/yourname/path/to/sdd-templates/sdd-server/docker-compose.yml",
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

**Remember**: You must run `docker-compose up -d` first to start the persistent container!

### Configuration Options

You can customize the server behavior by setting environment variables:

```json
{
  "mcpServers": {
    "sdd-server": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "sdd-server:latest"],
      "env": {
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
3. **Test Connection** - Try using the SDD guide tool: `sdd_guide`

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
I want to build a todo application for teams
```

Cline will automatically use the `sdd_guide` tool to provide comprehensive guidance on implementing the SDD process for your project.

## MCP Tool

The server provides one main tool:

### SDD Guide (`sdd_guide`)

Provides comprehensive guidance on the Spec Driven Development process and instructs AI assistants on how to create SDD documentation.

**Parameters:**
- `query` (string): User query or project description to guide the SDD process (1-1000 characters)

**Example:**
```json
{
  "query": "I want to build a todo application for teams"
}
```

**What it does:**
- Explains the SDD methodology (Requirements → Design → Tasks → Implementation)
- Instructs the AI to create a `.sdd/` directory
- Guides creation of three core files:
  - `requirements.md` - User stories and acceptance criteria
  - `design.md` - System architecture and tech stack
  - `tasks.md` - Implementation plan with tasks and estimates

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

The server supports basic configuration through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_NAME` | Server identification name | sdd-server |
| `SERVER_VERSION` | Server version | 0.1.0 |

## Troubleshooting

### Common Issues

1. **Server Not Starting**
   - Ensure Node.js 18+ is installed
   - Check that all dependencies are installed with `npm install`
   - Verify the build completed successfully with `npm run build`

2. **Docker Issues**
   - Ensure Docker is running: `docker ps`
   - Check if the image was built: `docker images sdd-server`
   - Restart the container: `docker-compose restart`

### Debug Mode
Use the MCP Inspector for debugging:
```bash
npm run inspector
```

## Contributing

This is a lightweight MCP server for SDD guidance. For issues or feature requests, please refer to the project documentation.

## License

MIT License - see package.json for details.
