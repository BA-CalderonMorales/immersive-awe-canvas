FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install and configure locales properly
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    locales \
    && sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=en_US.UTF-8

# Install essential development tools
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    curl \
    git \
    git-lfs \
    build-essential \
    pkg-config \
    libssl-dev \
    python3 \
    python3-pip \
    python3-venv \
    ca-certificates \
    sudo \
    wget \
    unzip \
    gnupg \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create vscode user for better compatibility with VS Code (Codespaces uses UID/GID 1000)
# The node:20-noble image already has a node user with UID 1000, so we'll use that
RUN usermod -l vscode node \
    && groupmod -n vscode node \
    && usermod -d /home/vscode -m vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers \
    && mkdir -p /home/vscode \
    && chown -R vscode:vscode /home/vscode \
    && echo 'export LANG=en_US.UTF-8' >> /home/vscode/.profile \
    && echo 'export LC_ALL=en_US.UTF-8' >> /home/vscode/.profile \
    && echo 'export LC_CTYPE=en_US.UTF-8' >> /home/vscode/.profile \
    && echo 'export LC_COLLATE=en_US.UTF-8' >> /home/vscode/.profile \
    && echo 'export LC_MESSAGES=en_US.UTF-8' >> /home/vscode/.profile

# Install Bun globally for all users
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.34" \
    && mv /root/.bun /usr/local/bun \
    && ln -s /usr/local/bun/bin/bun /usr/local/bin/bun \
    && ln -s /usr/local/bun/bin/bunx /usr/local/bin/bunx

# Verify installations
RUN node --version && npm --version && bun --version

# Install global npm packages for development
RUN npm install -g \
    typescript \
    @biomejs/biome

# Set locale environment variables
ENV LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8 \
    LC_CTYPE=en_US.UTF-8 \
    LC_COLLATE=en_US.UTF-8 \
    LC_MESSAGES=en_US.UTF-8

# Set up workspace
WORKDIR /workspaces/immersive-awe-canvas