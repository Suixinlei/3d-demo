# 基础镜像
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
COPY --from=base /app/build ./build
EXPOSE 4001

CMD ["npx", "serve", "-s", "build", "-l", "4001"]