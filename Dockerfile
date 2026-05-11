FROM node:20-alpine

RUN npm install -g pnpm@10

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/api-server run build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "artifacts/api-server/dist/index.mjs"]
