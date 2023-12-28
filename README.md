## 开始开发

1. 安装 wrangler-cli

```bash
npm i @cloudflare/wrangler -g
```

根据文档登录 cloudflare 账号：

```bash
wrangler login
```

执行上面的命令后，会在浏览器打开一个页面，跳转到 cloudflare 的登录页面，然后点击授权登录，然后会跳转到一个页面，然后在终端输入 `wrangler whoami`，如果显示你的用户名，说明登录成功了。

2. 安装依赖

```bash
# 安装后端依赖
yarn install

# 安装前端依赖
cd static
yarn install
```

3. 在 cloudflare 里创建 kv namespace

![image](https://as.al/file/zLTJTR)

我们这里创建了两个 kv，一个用来存储文件，一个用来存储文字，然后分别取名为 `PBIMG` 和 `PB`，其实名字无所谓，重点是要记住 id，后面会用到

4. 修改 wrangler.toml

```toml
name= "pastebin-worker"
compatibility_date = "2023-11-28"
account_id= "<account_id>" # 这里改成你自己的 account_id
main = "src/index.ts"
workers_dev = false

vars = { ENVIRONMENT = "production" }
route = { pattern = "<your domain>", custom_domain = true }

kv_namespaces = [
  { binding = "PB", id = "<PB kv id>" },
  { binding = "PBIMGS", id ="<PB file id>" }
]

[site]
bucket = "./static/dist"
```

其中 `account_id`，`route`, `kv_namespaces` 需要根据自己的情况修改，我们这里用到了两个 kv，一个存储文件，一个存储文字。

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

# 部署

修改 static 目录里的 `.env.production`，环境变量设置为你自己上面配置的域名。

```env
VITE_API_URL= <your domain>
```

获取你的 cloudflare 账号的 api key，然后设置为 github aciton 的 secret，名字为`CF_API_TOKEN`，这样每次 push 代码到 main 分支，就会自动部署到 cloudflare

### 获取 API Token 的方法：

![image](https://as.al/file/wRVEmh)

然后点击 `Create Token`:

![image](https://as.al/file/5a927R)

选择 worker 的模版创建成功即可获取 api token

![image](https://as.al/file/0PhErY)

### 在 github action 里设置 secret

![image](https://as.al/file/HY97Ka)

在这里设置你的 api token，而后每次 push 代码到 main 分支，就会自动部署到 cloudflare
