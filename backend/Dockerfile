FROM oven/bun:latest

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 4000

CMD ["bun", "run", "start"]
