[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xiadd/pastebin-worker)

## 开始开发

### 1. 安装 wrangler-cli

```bash
npm i @cloudflare/wrangler -g
```

根据文档登录 cloudflare 账号：

```bash
wrangler login
```

执行上面的命令后，会在浏览器打开一个页面，跳转到 cloudflare 的登录页面，然后点击授权登录，然后会跳转到一个页面，然后在终端输入 `wrangler whoami`，如果显示你的用户名，说明登录成功了。

### 2. 安装依赖

```bash
# 安装后端依赖
yarn install

# 安装前端依赖
cd static
yarn install
```

### 3. 在 CloudFlare 里创建 D1 namespace

![Create_D1_Database](<./img/Create_D1_Database.png>)

我们这里创建了一个 database，名字是 `pastebins`，进入这个 database

![Create_D1_Table](<./img/Create_D1_Table.png>)

复制 [schema.sql](src/schema.sql) 的语句到这里，手动执行，这样就完成了数据库的创建和配置

### 4. 修改 wrangler.toml

```toml
name = "pastebin-worker"
compatibility_date = "2023-10-30"
compatibility_flags = ["nodejs_compat"]

account_id = <ACCOUNT_ID> # 你的 cloudflare 账号 id
main = "src/index.ts"
workers_dev = false

[vars]
ENVIRONMENT = "production"
BASE_URL = "https://as.al" # 你的BaseUrl

[site]
bucket = "./static/dist"

# 如果不使用自定义域名，将下面的代码注释掉
[[routes]]
pattern = "as.al" # 自定义域名
custom_domain = true

[[r2_buckets]]
binding = 'BUCKET'
bucket_name = 'pastes'

[[d1_databases]]
binding = "DB"
database_name = "pastebins" # 你的 D1 database name
database_id = <DATABASE_ID> # 你的 D1 database id
```

其中 `account_id`，`route`, `kv_namespaces` 需要根据自己的情况修改，我们这里用到了两个 kv，一个存储文件，一个存储文字。如果不需要自定义域名，注释掉 `route` 这行即可。

`account_id` 可以在 cloudflare 的 dashboard 中找到, `route` 是你的 worker 的路由（也就是自定义域名），`kv_namespaces` 是你创建的 kv 的 id

5. 开发

```bash
# 启动后端
wrangler dev

# 启动前端
cd static
yarn dev
```

服务器启动后，后端的地址是 `http://localhost:8787`，前端的地址是 `http://localhost:5173`，如果想测试前端打包后的情况，直接在 static 目录执行 `yarn build`，然后访问 `http://localhost:8787` 就可以了

# API 调用

## 分享文字 API

1. 创建 paste

```
url: https://as.al/api/create
method: POST
payload: {
  "content": "<your text>",
  "isPrivate": false,
  "language": "text",
  "share_password": ""
}
# 返回的数据
{
  "id": "opNGEX",
  "url": "https://as.al/detail/opNGEX",
  "content": "12312",
  "expire": 0,
  "language": "text",
  "create_time": 1705587763620
}

```

如果想创建私有的 paste，则自行设置 share_password 分享密码

2. 获取 paste 详情

```

url: https://as.al/api/get?id=<paste_id>

# 返回的数据

{
  "content": "12312",
  "url": "https://as.al/detail/opNGEX",
  "language": "text",
  "create_time": 1705587763620
}
```

## 分享文件 API

1. 创建文件分享 paste

```
url: https://as.al/api/upload
method: POST
formData: { "file": <binaryFile> }

# 返回的数据

{
  "id": "7tAFLZ",
  "url": "https://as.al/file/7tAFLZ"
}
```

2. 获取文件 url

上面的文件 url 就是文件上传后的地址

# 部署

## 手动部署

首先需要[在 cloudflare 里创建 D1 namespace](#3-在-cloudflare-里创建-d1-namespace)。手动创建D1数据库，并执行SQL语句

然后获取你的 cloudflare 账号的 api key，然后设置为 github aciton 的 secret，名字为`CF_API_TOKEN`，这样每次 push 代码到 main 分支，就会自动部署到 cloudflare

### 获取 API Token 的方法：

![image](https://as.al/file/a60SQE)

然后点击 `Create Token`:

![image](https://as.al/file/iLcJMi)

选择 worker 的模版创建成功即可获取 api token

### 在 github action 里设置 secret

![image](https://as.al/file/Zl8rbJ)

在这里设置你的 api token，而后每次 push 代码到 main 分支，就会自动部署到 cloudflare

## 自动部署

点击上面的 `Deploy with Workers` 按钮，然后根据提示操作即可。
