import { useState } from 'react';
import Upload from 'rc-upload';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';

export default function ImageShare() {
  const { t } = useTranslation();
  const [uploadFile, setUploadFile] = useState<string>('');
  const [loadingToast, setLoadingToast] = useState<string>('');

  const props = {
    action: `${import.meta.env.VITE_API_URL}/api/upload`,
    type: 'drag',
    accept: '*',
    onStart(file: any) {
      const loading = toast.loading('上传中');
      setLoadingToast(loading);
    },
    onSuccess(file: any) {
      setUploadFile(`${import.meta.env.VITE_API_URL}/file/${file.id}`);
      toast.dismiss(loadingToast);
    },
    onError(err: any, response: any) {
      console.log(response);
      toast.error(`上传失败: ${response.error}`);
      toast.dismiss(loadingToast);
    },
  };

  return (
    <div className="flex flex-col gap-3">
      <Upload {...props}>
        <div className="w-full">
          <label className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="font-medium text-gray-600">
                {t('fileShareTip')}
                <span className="text-blue-600 underline ml-2">
                  {t('viewFiles')}
                </span>
              </span>
            </span>
          </label>
        </div>
      </Upload>

      {uploadFile && (
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">上传成功</h2>
            <p>文件已经上传成功，由于成本问题，文件1天内有效，点击复制文件</p>
            <div className="card-actions justify-end">
              <CopyToClipboard
                text={uploadFile}
                onCopy={() => toast.success('复制成功')}
              >
                <button className="btn btn-primary">复制文件地址</button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
