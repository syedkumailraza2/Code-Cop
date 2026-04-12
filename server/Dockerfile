FROM node:20-slim

# Install git (required for cloning repos)
RUN apt-get update && apt-get install -y git curl unzip && rm -rf /var/lib/apt/lists/*

# Install ruff (Python linter)
RUN curl -LsSf https://astral.sh/ruff/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Install golangci-lint (Go linter)
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b /usr/local/bin

# Install Dart SDK (for dart analyze)
RUN curl -fsSL https://storage.googleapis.com/dart-archive/channels/stable/release/latest/sdk/dartsdk-linux-x64-release.zip -o dart.zip \
    && unzip dart.zip -d /opt \
    && rm dart.zip
ENV PATH="/opt/dart-sdk/bin:$PATH"

# Install TypeScript compiler globally (for tsc --noEmit)
RUN npm install -g typescript

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
