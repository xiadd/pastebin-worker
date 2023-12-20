export default function Turorial() {
  return (
    <div className="prose !max-w-full">
      <h2>使用教程</h2>
      <p>本网站是基于 cloudflare worker 实现的文字和文件分享工具。</p>
      <h2>命令行使用</h2>

      <pre
        dangerouslySetInnerHTML={{
          __html: `curl 'https://pastes.551111.xyz/api/create' --data-raw '{"content":"123123","expire":121,"isPrivate":true}'`,
        }}
      ></pre>

      <h2>开源地址</h2>

      <p className="text-lg">
        <a href="https://github.com/xiadd/pastebin-worker/">
          https://github.com/xiadd/pastebin-worker/
        </a>
        ，欢迎使用和star，如果有问题可以直接提issue。
      </p>
    </div>
  );
}
