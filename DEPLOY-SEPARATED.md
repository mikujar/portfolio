# 前后端分离部署指南

## 架构概览

```
用户浏览器
    ↓
Vercel (前端静态页面)
    ↓ API请求
腾讯云轻量服务器 (后端API)
    ↓ 文件存储
腾讯云COS (视频/图片)
```

---

## 第一步：创建腾讯云 COS 存储桶

### 1.1 创建存储桶

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 搜索"对象存储"或直接访问 COS 控制台
3. 点击"创建存储桶"
4. 配置：
   - **名称**：`portfolio-media`（会自动加上 AppID 后缀）
   - **所属地域**：选择离用户近的，如 `广州`
   - **访问权限**：**公有读私有写**（重要！）
5. 创建完成后，记录：
   - 存储桶名称：如 `portfolio-media-1234567890`
   - 所属地域：如 `ap-guangzhou`

### 1.2 获取 API 密钥

1. 访问 [访问管理](https://console.cloud.tencent.com/cam/capi)
2. 点击"新建密钥"
3. 记录 `SecretId` 和 `SecretKey`

> ⚠️ 密钥非常重要，请妥善保管，不要泄露！

### 1.3 配置跨域访问（CORS）

1. 在 COS 控制台，进入你的存储桶
2. 左侧菜单 → 安全管理 → 跨域访问 CORS 设置
3. 添加规则：
   - **来源 Origin**：`*`
   - **操作 Methods**：`GET, POST, PUT, HEAD`
   - **Allow-Headers**：`*`
   - **Expose-Headers**：`ETag`
   - **超时 Max-Age**：`600`

---

## 第二步：使用 1Panel 部署后端（图形界面）

> 以下所有操作都在 1Panel Web 界面完成，无需使用终端

### 2.1 安装 1Panel（如果还没安装）

在腾讯云轻量服务器控制台，选择"重装系统" → 选择 **1Panel** 镜像即可自动安装。

或者访问服务器后在终端执行一次：
```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh
```

### 2.2 安装 Node.js 运行环境

1. 打开 1Panel 管理面板（`http://服务器IP:端口`）
2. 左侧菜单 → **应用商店**
3. 搜索 **Node.js**，点击安装
4. 选择版本 **20.x**，点击确认安装

### 2.3 上传后端代码

1. 左侧菜单 → **文件**
2. 进入目录 `/opt`
3. 点击 **新建文件夹**，命名为 `portfolio`
4. 进入 `/opt/portfolio` 目录
5. 点击 **上传**，上传以下文件：
   - `server/index.js`
   - `server/db.js`
   - `server/package.json`
   - `server/package-lock.json`

### 2.4 创建环境变量文件

1. 在 `/opt/portfolio` 目录下
2. 点击 **新建** → **新建文件**
3. 文件名：`.env`
4. 内容：

```
PORT=3001
ADMIN_PASSWORD=你的管理员密码
COS_SECRET_ID=你的SecretId
COS_SECRET_KEY=你的SecretKey
COS_BUCKET=你的存储桶名称
COS_REGION=ap-guangzhou
FRONTEND_URL=https://你的前端.vercel.app
```

5. 点击保存

### 2.5 安装依赖（在 1Panel 终端）

1. 左侧菜单 → **主机** → **终端**
2. 执行以下命令：

```bash
cd /opt/portfolio
npm install --production
```

### 2.6 创建 Node.js 应用

1. 左侧菜单 → **应用商店** → **已安装**
2. 找到 Node.js，点击 **管理**
3. 点击 **添加应用**
4. 配置：
   - **应用名称**：`portfolio-api`
   - **项目目录**：`/opt/portfolio`
   - **启动文件**：`index.js`
   - **端口**：`3001`
5. 点击确认

### 2.7 配置反向代理 + HTTPS

1. 左侧菜单 → **网站**
2. 点击 **创建网站** → **反向代理**
3. 配置：
   - **主域名**：`api.你的域名.com`
   - **代理地址**：`http://127.0.0.1:3001`
4. 点击确认
5. 在网站列表中找到刚创建的网站
6. 点击 **设置** → **HTTPS**
7. 点击 **申请证书**（Let's Encrypt 免费证书）
8. 开启 **强制 HTTPS**

### 2.8 配置大文件上传

1. 在网站设置中 → **配置文件**
2. 找到 `client_max_body_size`，修改为 `500m`
3. 保存并重载配置

### 2.9 开放防火墙端口

1. 左侧菜单 → **主机** → **防火墙**
2. 添加规则，开放端口 **3001**（如果使用反向代理可以不开放）
3. 同时在腾讯云控制台的"防火墙"中也要开放相应端口

---

## 第三步：部署前端到 Vercel

### 3.1 推送代码到 GitHub

```bash
# 在项目根目录
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/portfolio.git
git push -u origin main
```

### 3.2 在 Vercel 部署

1. 访问 [Vercel](https://vercel.com/) 并登录
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 配置项目：
   - **Framework Preset**：Vite
   - **Root Directory**：./（默认）
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`

### 3.3 配置环境变量

在 Vercel 项目设置 → Environment Variables 中添加：

| 变量名 | 值 |
|--------|-----|
| `VITE_API_URL` | `https://api.你的域名.com` |

### 3.4 重新部署

添加环境变量后，点击 "Redeploy" 重新部署。

---

## 第四步：验证部署

1. 访问 Vercel 分配的域名（如 `https://portfolio-xxx.vercel.app`）
2. 测试功能：
   - 浏览视频、照片、摘抄
   - 登录管理员账户
   - 上传新的视频/照片（检查是否上传到 COS）

---

## 常见问题

### Q: 上传失败，提示 CORS 错误

检查：
1. COS 存储桶的 CORS 配置是否正确
2. 后端环境变量 `FRONTEND_URL` 是否设置正确

### Q: API 请求失败

检查：
1. 后端服务是否运行：`pm2 status`
2. Nginx 配置是否正确：`sudo nginx -t`
3. 端口是否开放：检查防火墙设置

### Q: 图片/视频加载失败

检查：
1. COS 存储桶是否设置为"公有读"
2. COS 地域是否配置正确

---

## 环境变量汇总

### 后端（轻量服务器 .env）

```env
PORT=3001
ADMIN_PASSWORD=你的密码
COS_SECRET_ID=xxx
COS_SECRET_KEY=xxx
COS_BUCKET=portfolio-media-1234567890
COS_REGION=ap-guangzhou
FRONTEND_URL=https://xxx.vercel.app
```

### 前端（Vercel 环境变量）

```
VITE_API_URL=https://api.你的域名.com
```
