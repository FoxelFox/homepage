FROM imbios/bun-node:22-debian

COPY package.json ./
COPY tsconfig.json ./
COPY bun.lock ./
COPY src ./src

RUN bun install -g @angular/cli && bun install && bun run client
CMD cp -r src/client/dist/client/browser/* /var/www/public && bun run server
