# Agent Memory Storage

## Purpose

This directory stores consolidated agent memory, development guidelines, workflow rules, and persistent state information for Claude Code and Claude Flow swarm orchestration systems.

## Consolidated Structure

```
memory/agents/
├── MEMORY.md               # Comprehensive development guidelines and session history
├── RULES.md                # Repository workflow rules and commit standards  
├── README.md               # This file - explains the memory system
├── shared/                 # Cross-agent shared resources (when needed)
│   ├── common_knowledge.md # Shared knowledge across agents
│   └── global_config.json  # Global agent configurations
└── swarm_instances/        # Individual swarm instance data (created dynamically)
    ├── swarm_001/
    │   ├── coordination.json   # Swarm coordination state
    │   ├── agent_roster.json  # Active agents and their roles
    │   └── memory_snapshots/  # Point-in-time memory captures
    └── ...
```

## Key Files

- **MEMORY.md**: Master development guidelines, TDD principles, coding standards, and session history
- **RULES.md**: Repository-specific workflow rules, commit standards, and CI/CD guidelines
- **claude-flow-data.json**: Persistent swarm coordination data (at memory root level)

## Swarm Integration

This memory system supports both individual Claude Code sessions and Claude Flow swarm orchestration:

### Individual Sessions
- Claude Code reads MEMORY.md for development guidelines
- Session-specific data goes to `memory/sessions/`
- Persistent decisions and learnings are documented in MEMORY.md

### Swarm Operations  
- Claude Flow coordinates multiple agents using the shared memory system
- Each swarm instance gets isolated coordination data
- Agents share knowledge through the memory/agents/shared/ directory
- Cross-session coordination data persists in claude-flow-data.json

## Usage Guidelines

1. **Centralized Guidelines**: All agents reference MEMORY.md for consistent development practices
2. **Session Isolation**: Individual sessions use memory/sessions/ for temporary data
3. **Swarm Coordination**: Dynamic swarm data goes to swarm_instances/ subdirectories
4. **Shared Knowledge**: Use shared/ directory for cross-agent information that should persist
5. **Documentation**: Update MEMORY.md with significant learnings and session summaries

## Last Updated

2025-01-22T03:48:00.000Z - Consolidated agents/ directory into memory/agents/ structure
