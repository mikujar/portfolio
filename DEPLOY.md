# 部署到 1Panel

## 方式一：通过 Docker Compose（推荐）

### 1. 上传项目文件

将以下文件/目录上传到服务器（例如 `/opt/portfolio/`）：

```
portfolio/
├── dist/              # 前端构建产物
├── server/            # 后端代码
├── data/              # 数据目录（会自动创建）
├── uploads/           # 上传目录（会自动创建）
├── Dockerfile
├── docker-compose.yml
└── .dockerignore
```

### 2. 配置环境变量

在 1Panel 中设置环境变量，或创建 `.env` 文件：

```bash
ADMIN_PASSWORD=你的管理员密码
```

### 3. 启动容器

```bash
cd /opt/portfolio
docker-compose up -d --build
```

### 4. 配置反向代理

在 1Panel -> 网站 -> 创建网站 -> 反向代理：

- **代理地址**: `http://127.0.0.1:3001`
- **域名**: 你的域名

### 5. 配置 HTTPS（可选）

在 1Panel -> 网站 -> 你的网站 -> HTTPS -> 申请证书

---

## 方式二：通过 1Panel 应用商店

### 如果 1Panel 支持 Node.js 应用：

1. 在 1Panel -> 应用商店 -> 已安装 -> Node.js
2. 创建新应用，指向 `server/` 目录
3. 启动命令：`node index.js`
4. 端口：3001

---

## 访问网站

- 网站地址: `http://你的域名/`
- 管理员登录: 点击页面底部的设置图标，输入管理员密码

---

## 常用命令

```bash
# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新部署
docker-compose down
docker-compose up -d --build
```

---

## 数据持久化

- 数据库文件: `./server/data.db`（SQLite）
- 上传文件: `./uploads/`

建议定期备份 `data.db` 和 `uploads/` 目录。
