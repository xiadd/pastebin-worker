# Pastebin Worker

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xiadd/pastebin-worker)

**语言**: [English](README.md) | 中文

基于 Cloudflare Workers 构建的现代、快速、安全的文本分享服务，支持语法高亮的文本分享、文件上传、密码保护和过期设置。

## 功能特性

- 📝 **文本分享**: 分享代码片段和文本，支持多种语言的语法高亮
- 📁 **文件上传**: 上传和分享文件，最大支持 25MB
- 🔒 **密码保护**: 创建带密码保护的私有分享
- ⏰ **过期设置**: 设置自动过期时间（1 分钟到 1 个月）
- 🎨 **语法高亮**: 支持 JavaScript、TypeScript、Python、Go、C/C++、JSON、YAML、Markdown、CSS、Shell 等多种语言
- 🌐 **现代界面**: 使用 React 和 Tailwind CSS 构建的简洁响应式界面
- 🚀 **高性能**: 基于 Cloudflare Workers 边缘计算
- 📱 **移动友好**: 响应式设计，适配所有设备
- 🔗 **API 访问**: 提供 RESTful API 供程序化访问

## 技术栈

- **后端**: Cloudflare Workers + Hono 框架
- **前端**: React 18 + TypeScript + Vite
- **数据库**: Cloudflare D1 (SQLite) + Drizzle ORM
- **存储**: Cloudflare R2 用于文件上传
- **样式**: Tailwind CSS + Radix UI 组件
- **代码编辑器**: Monaco Editor (VS Code 编辑器)
- **ORM**: Drizzle ORM 提供类型安全的数据库操作

## 开始使用

### 前置要求

- Node.js 18+ 和 Yarn
- Cloudflare 账户
- Wrangler CLI

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

登录到您的 Cloudflare 账户：

```bash
wrangler login
```

执行上述命令后，会在浏览器中打开一个页面进行 Cloudflare 登录。授权后，运行 `wrangler whoami` 验证登录是否成功。

### 2. 安装依赖

```bash
# 安装后端依赖
yarn install

# 安装前端依赖
cd static
yarn install
```

### 3. 创建 Cloudflare D1 数据库

在 Cloudflare 控制台中创建新的 D1 数据库：

![Create_D1_Database](./img/Create_D1_Database.png)

创建名为 `pastebins` 的数据库，然后进入数据库控制台：

![Create_D1_Table](./img/Create_D1_Table.png)

复制 [schema.sql](src/schema.sql) 中的 SQL 语句并在控制台中执行，以设置数据库架构。

或者，您可以使用 Wrangler 初始化数据库：

```bash
# 初始化远程数据库
yarn initdb:remote

# 初始化本地开发数据库
yarn initdb:local
```

### 使用 Drizzle ORM 进行数据库迁移

本项目使用 Drizzle ORM 进行类型安全的数据库操作。数据库架构定义在 `src/db/scheme.ts` 中。管理数据库变更：

```bash
# 在架构更改后生成迁移文件
yarn db:generate

# 将迁移应用到本地数据库
yarn db:migrate:local

# 将迁移应用到远程数据库
yarn db:migrate:remote
```

### 4. 创建 Cloudflare R2 存储桶

在 Cloudflare 控制台中创建用于文件存储的 R2 存储桶。将其命名为 `pastes` 或在 `wrangler.toml` 中更新存储桶名称。

### 5. 配置 wrangler.toml

使用您的账户详细信息更新配置文件：

```toml
name = "pastebin-worker"
compatibility_date = "2023-10-30"
compatibility_flags = ["nodejs_compat"]

account_id = "<YOUR_ACCOUNT_ID>" # 您的 Cloudflare 账户 ID
main = "src/index.ts"
workers_dev = false

[vars]
ENVIRONMENT = "production"
BASE_URL = "https://your-domain.com" # 您的基础 URL

[site]
bucket = "./static/dist"

# 如果不使用自定义域名，请注释掉以下部分
[[routes]]
pattern = "your-domain.com" # 您的自定义域名
custom_domain = true

[[r2_buckets]]
binding = 'BUCKET'
bucket_name = 'pastes'

[[d1_databases]]
binding = "DB"
database_name = "pastebins" # 您的 D1 数据库名称
database_id = "<YOUR_DATABASE_ID>" # 您的 D1 数据库 ID
```

将 `<YOUR_ACCOUNT_ID>` 和 `<YOUR_DATABASE_ID>` 替换为您实际的 Cloudflare 账户 ID 和 D1 数据库 ID。如果不需要自定义域名，请注释掉 `[[routes]]` 部分。

### 6. 开发

```bash
# 启动后端开发服务器
wrangler dev

# 在另一个终端中，启动前端开发服务器
cd static
yarn dev
```

后端将在 `http://localhost:8787` 可用，前端在 `http://localhost:5173`。要测试生产构建，请在 static 目录中运行 `yarn build` 并访问 `http://localhost:8787`。

## API 参考

### 文本分享 API

#### 创建分享

**接口**: `POST /api/create`

**请求体**:

```json
{
  "content": "您的文本内容",
  "isPrivate": false,
  "language": "javascript",
  "share_password": "",
  "expire": 3600
}
```

**参数**:

- `content` (string, 必需): 要分享的文本内容
- `isPrivate` (boolean, 可选): 是否为私有分享 (默认: false)
- `language` (string, 可选): 语法高亮语言 (默认: "text")
- `share_password` (string, 可选): 私有分享的密码
- `expire` (number, 可选): 过期时间（秒）(0 = 永不过期)

**响应**:

```json
{
  "id": "opNGEX",
  "url": "https://your-domain.com/detail/opNGEX",
  "content": "您的文本内容",
  "expire": 3600,
  "language": "javascript",
  "create_time": 1705587763620
}
```

#### 获取分享详情

**接口**: `GET /api/get?id=<paste_id>&share_password=<password>`

**参数**:

- `id` (string, 必需): 分享 ID
- `share_password` (string, 可选): 私有分享的密码

**响应**:

```json
{
  "content": "您的文本内容",
  "url": "https://your-domain.com/detail/opNGEX",
  "language": "javascript",
  "create_time": 1705587763620
}
```

#### 获取原始分享内容

**接口**: `GET /raw/<paste_id>?share_password=<password>`

返回不带任何格式的原始文本内容。

### 文件上传 API

#### 上传文件

**接口**: `POST /api/upload`

**请求**: 包含 `file` 字段的 multipart form data

**使用 curl 的示例**:

```bash
curl -X POST https://your-domain.com/api/upload \
  -F "file=@example.txt"
```

**响应**:

```json
{
  "id": "7tAFLZ",
  "url": "https://your-domain.com/file/7tAFLZ"
}
```

#### 访问上传的文件

**接口**: `GET /file/<file_id>`

返回上传的文件，带有适当的下载或内联查看头部。

### 命令行使用

使用 curl 创建分享：

```bash
curl 'https://your-domain.com/api/create' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "console.log(\"Hello World\");",
    "language": "javascript",
    "expire": 3600
  }'
```

## 部署

### 前置条件

部署前，请确保您已经：

1. [创建了 Cloudflare D1 数据库](#3-创建-cloudflare-d1-数据库) 并执行了架构
2. [创建了 Cloudflare R2 存储桶](#4-创建-cloudflare-r2-存储桶) 用于文件存储
3. [配置了 wrangler.toml](#5-配置-wranglertoml) 包含您的账户详细信息

### 手动部署

使用 Wrangler 手动部署：

```bash
# 构建前端
cd static
yarn build
cd ..

# 部署到 Cloudflare Workers
wrangler deploy
```

### 使用 GitHub Actions 自动部署

此项目包含 GitHub Actions 工作流，可在每次推送到主分支时自动部署。

#### 设置 GitHub Actions

1. **获取您的 Cloudflare API Token**:

   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - 点击 "Create Token"
   - 使用 "Custom token" 模板，包含以下权限：
     - Account: Cloudflare Workers:Edit
     - Zone: Zone:Read (如果使用自定义域名)
     - Zone Resources: Include All zones (如果使用自定义域名)

2. **将 API Token 添加到 GitHub Secrets**:

   - 转到您的 GitHub 仓库
   - 导航到 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 名称: `CF_API_TOKEN`
   - 值: 您的 Cloudflare API token

3. **部署**: 推送到主分支，工作流将自动部署您的更改。

### 一键部署

点击此 README 顶部的部署按钮，直接部署到 Cloudflare Workers。

## 数据库管理

### 初始化数据库架构

```bash
# 初始化远程数据库（生产环境）
yarn initdb:remote

# 初始化本地数据库（开发环境）
yarn initdb:local
```

### Drizzle ORM 命令

本项目使用 Drizzle ORM 进行类型安全的数据库操作：

```bash
# 在架构更改后生成迁移文件
yarn db:generate

# 将迁移应用到本地数据库
yarn db:migrate:local

# 将迁移应用到远程数据库
yarn db:migrate:remote
```

### 数据库架构

应用程序使用在 `src/db/scheme.ts` 中定义的两个主要表：

- `pastes`: 存储文本分享及其元数据
- `files`: 为将来的文件元数据保留（当前文件存储在 R2 中）

得益于 Drizzle ORM，所有数据库操作都是类型安全的，它提供：

- 自动 TypeScript 类型生成
- 带类型检查的 SQL 查询构建器
- 迁移管理
- 更好的开发体验和智能提示

## 配置

### 环境变量

在 `wrangler.toml` 的 `[vars]` 部分设置这些变量：

- `ENVIRONMENT`: 生产部署时设置为 "production"
- `BASE_URL`: 您应用程序的基础 URL（例如："https://your-domain.com"）

### 存储配置

- **D1 数据库**: 用于存储分享元数据和内容
- **R2 存储桶**: 用于文件上传（每个文件最大 25MB）

## 贡献

1. Fork 此仓库
2. 创建功能分支
3. 进行更改
4. 使用 `wrangler dev` 本地测试
5. 提交 pull request

## 许可证

MIT 许可证 - 详见 LICENSE 文件。
