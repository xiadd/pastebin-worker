## 开始开发

1. 安装 wrangler-cli

```bash
npm i @cloudflare/wrangler -g
```

根据文档登录 cloudflare 账号

2. 安装依赖

```bash
# 安装后端依赖
yarn install

# 安装前端依赖
cd static
yarn install
```

3. 修改 wrangler.toml

其中 `account_id`，`route`, `kv_namespaces` 需要根据自己的情况修改，我们这里用到了两个kv，一个存储文件，一个存储文字。

account_id 可以在 cloudflare 的 dashboard 中找到, route 是你的 worker 的路由（也就是自定义域名），kv_namespaces 是你创建的 kv 的 id

4. 开发

```bash
# 启动后端
wrangler dev

# 启动前端
cd static
yarn dev
```

服务器启动后，后端的地址是 `http://localhost:8787`，前端的地址是 `http://localhost:5173`，如果想测试前端打包后的情况，直接在 static 目录执行 `yarn build`，然后访问 `http://localhost:8787` 就可以了

# 部署

修改static目录里的.env.production，环境变量设置为你自己上面配置的域名。

获取你的 cloudflare 账号的 api key，然后设置为 github aciton 的 secret，名字为`CF_API_TOKEN`，这样每次 push 代码到 main 分支，就会自动部署到 cloudflare
