# Base image
FROM node AS base

# Install pnpm globally
RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM dependencies AS build

WORKDIR /app
COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM node AS deploy

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

ENV DATABASE_URL=mongodb+srv://nhatlinhdut3:td1uAMAgupGhminV@pbl7.ozxnm0y.mongodb.net/test?retryWrites=true&w=majority&appName=pbl7
ENV JWT_SECRET=linhdeptrai
ENV SMTP_PASS=ucts zclv stcm xyoq
ENV SMTP_HOST=smtp.gmail.com
ENV SMTP_PORT=587
ENV SMTP_USER=dangquangnhatlinh123@gmail.com

ENV PORT=3000

CMD ["node", "dist/src/index.js"]
