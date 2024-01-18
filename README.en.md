## Start Developing

1. Install wrangler-cli

```bash
npm i @cloudflare/wrangler -g
```

Log in to your Cloudflare account according to the documentation:

```bash
wrangler login
```

After executing the above command, a page will open in the browser, redirecting to the Cloudflare login page. Click to authorize login, and it will redirect to another page. Then input `wrangler whoami` in the terminal. If it displays your username, it means you have successfully logged in.

2. Install Dependencies

```bash
# Install backend dependencies
yarn install

# Install frontend dependencies
cd static
yarn install
```

3. Create kv namespace in Cloudflare

![image](https://as.al/file/unJ46x)

We have created two kv namespaces here, one for storing files and the other for storing text, and they are named `PBIMG` and `PB` respectively. It doesn't matter what names are given, the important thing is to remember the id, which will be used later.

4. Modify wrangler.toml

```toml
name= "pastebin-worker"
compatibility_date = "2023-11-28"
account_id= "<account_id>" # Replace this with your own account_id
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

`account_id`, `route`, `kv_namespaces` should be modified according to your own situation. We are using two kvs here, one for storing files and the other for storing text.

`account_id` can be found in the Cloudflare dashboard. `route` is the route of your worker (i.e., the custom domain), and `kv_namespaces` is the id of the kv you created.

5. Development

```bash
# Start the backend
wrangler dev

# Start the frontend
cd static
yarn dev
```

After the server is started, the backend address is `http://localhost:8787`, and the front-end address is `http://localhost:5173`. If you want to test the frontend package, directly execute `yarn build` in the static directory, and visit `http://localhost:8787`.

# Deploy

Modify `.env.production` in the static directory, and set the environment variable to the domain name you configured above.

```env
VITE_API_URL= <your domain>
```

Get the api key for your Cloudflare account, then set it as the secret for GitHub action, named `CF_API_TOKEN`. This way, whenever you push code to the main branch, it will automatically deploy to Cloudflare.

### Method to get the API Token:

![image](https://as.al/file/a60SQE)

Then click `Create Token`:

![image](https://as.al/file/iLcJMi)

Select the worker template and create it to get the api token.

### Set the secret in the github action:

![image](https://as.al/file/Zl8rbJ)

Set your api token here.
