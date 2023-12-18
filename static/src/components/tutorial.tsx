export default function Turorial() {
  return (
    <div className="prose !max-w-full">
      <h2>使用教程</h2>
      <p>本网站是基于 cloudflare worker 实现的文字和图片分享工具。</p>
      <p>
        图片分享基于{' '}
        <a href="https://telegra.ph/" target="_blank" rel="noopener noreferrer">
          https://telegra.ph/
        </a>{' '}
        的图片上传，如有侵权请联系我删除。由于worker
        限额问题，图片有效期默认为1天。请注意保存图片
      </p>
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
