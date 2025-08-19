FROM oven/bun:latest

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
