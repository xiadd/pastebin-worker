export default function Turorial() {
  return (
    <div className="leading-loose flex gap-3 flex-col">
      <h2 className="text-2xl">使用教程</h2>
      <p className="text-lg">
        本网站是基于 cloudflare worker 实现的文字和图片分享工具。
      </p>

      <p className="text-lg">
        图片分享基于{' '}
        <a
          className="link link-primary"
          href="https://telegra.ph/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://telegra.ph/
        </a>{' '}
        的图片上传，如有侵权请联系我删除。由于worker
        限额问题，图片有效期默认为1天。请注意保存图片
      </p>

      <h2 className="text-2xl">命令行使用</h2>

      <div className="mockup-code">
        <pre
          data-prefix="$"
          dangerouslySetInnerHTML={{
            __html: `curl 'https://pastes.551111.xyz/api/create' --data-raw '{"content":"123123","expire":121,"isPrivate":true}'`,
          }}
        ></pre>
      </div>

      <h2 className="text-2xl">开源地址</h2>

      <p className="text-lg">
        <a
          className="link link-primary"
          href="https://github.com/xiadd/pastebin-worker/"
        >
          https://github.com/xiadd/pastebin-worker/
        </a>
        ，欢迎使用和star
      </p>
    </div>
  );
}
