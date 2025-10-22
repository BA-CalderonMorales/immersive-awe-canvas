FROM node:20-bookworm

# Install system dependencies including Git LFS and sudo
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    git-lfs \
    curl \
    wget \
    ca-certificates \
    build-essential \
    python3 \
    unzip \
    sudo \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Allow node user to use sudo without password
RUN echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Install Bun globally for all users
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.34" \
    && mv /root/.bun /usr/local/bun \
    && ln -s /usr/local/bun/bin/bun /usr/local/bin/bun \
    && ln -s /usr/local/bun/bin/bunx /usr/local/bin/bunx

# Verify Bun installation
RUN bun --version

# Install global npm packages for development
RUN npm install -g \
    typescript \
    @biomejs/biome \
    semantic-release \
    @semantic-release/changelog \
    @semantic-release/git

# Set up workspace
WORKDIR /workspaces