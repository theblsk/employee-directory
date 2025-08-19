FROM oven/bun:latest

# Avoid interactive prompts during apt operations and ensure HTTPS fetch works
ARG DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND=${DEBIAN_FRONTEND}
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

# Prestep: generate the SQLite database inside the image during build
RUN bun run db:seed

# Expose default port
EXPOSE 4000

# Start the server (uses package.json "start")
CMD ["bun", "run", "start"]
