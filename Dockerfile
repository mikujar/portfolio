FROM node:20-alpine

WORKDIR /app

# 复制后端依赖文件
COPY server/package*.json ./server/

# 安装后端依赖
WORKDIR /app/server
RUN npm ci --only=production

# 复制后端代码
COPY server/ ./

# 复制前端构建产物
WORKDIR /app
COPY dist/ ./dist/

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 暴露端口
EXPOSE 3001

# 启动服务
WORKDIR /app/server
CMD ["node", "index.js"]
