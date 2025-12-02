FROM oven/bun:1

WORKDIR /app

COPY package.json .

COPY prisma ./prisma

RUN bun install --production

RUN bun x prisma generate

COPY src ./src

EXPOSE 3000

CMD ["bun", "src/index.js"]