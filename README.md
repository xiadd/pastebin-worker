## 开始开发

1. 安装 wrangler-cli

```bash
npm i @cloudflare/wrangler -g
```

根据文档登录 cloudflare 账号

2. 安装依赖

```bash
yarn install
```

3. 修改 wrangler.toml

其中 `account_id`，`route`, `kv_namespaces` 需要根据自己的情况修改

account_id 可以在 cloudflare 的 dashboard 中找到, route 是你的 worker 的路由，kv_namespaces 是你创建的 kv 的 id

4. 开发

```bash
wrangler dev
yarn dev
```

## 部署

获取你的 cloudflare 账号的 api key，然后设置为 github aciton 的 secret，名字为`CF_API_KEY`，这样每次 push 代码到 main 分支，就会自动部署到 cloudflare
