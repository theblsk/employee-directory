FROM oven/bun:latest

# Avoid interactive prompts during apt operations
ARG DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND=${DEBIAN_FRONTEND}

# Ensure HTTPS fetch works (install CA certificates)
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first for better caching
COPY package.json ./
COPY bun.lock ./
RUN bun install --frozen-lockfile

# Copy application source
COPY . .

# Expose default port
EXPOSE 4000

# Start the server (uses package.json "start")
CMD ["bun", "run", "start"]
