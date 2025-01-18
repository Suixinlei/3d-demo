#!/bin/bash

# 设置环境变量
cp .env.production .env

# 创建必要的目录
ssh kouka "mkdir -p /home/xiaobin/app/doa3d"
ssh kouka "mkdir -p /home/xiaobin/storage/{database,database_backup,pgsql,pgsql_backup}"

# 清理
ssh kouka "rm -rf /home/xiaobin/app/doa3d/*"

# 复制项目文件到服务器
rsync -avz --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'dist' \
    --exclude '.git' \
    --exclude 'temp' \
    . kouka:/home/xiaobin/app/doa3d/

# 在服务器上构建和运行容器
ssh kouka "cd /home/xiaobin/app/doa3d && \
    docker compose -f docker-compose.yml up -d --build"