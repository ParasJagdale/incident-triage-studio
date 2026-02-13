FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY mcp-server.js ./
COPY archestra-config.json ./

ENV PORT=4100
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 4100

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4100/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "mcp-server.js"]
