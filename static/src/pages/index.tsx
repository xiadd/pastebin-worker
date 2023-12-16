import { useState, memo } from 'react';
import cn from 'classnames';
import TextShare from '../components/text-share';
import ImageShare from '../components/image-share';
import Turorial from '../components/tutorial';

export default memo(function CreatePaste() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const handleToggleTab = (tab: 'text' | 'image') => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 md:p-10 flex flex-col gap-3 mx-auto max-w-7xl">
      <h1 className="md:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 text-2xl">
        Yet another PasteBin based on Cloudflare Worker
      </h1>
      <div role="tablist" className="tabs tabs-boxed">
        <a
          role="tab"
          className={cn('tab', {
            'tab-active': activeTab === 'text',
          })}
          onClick={() => handleToggleTab('text')}
        >
          文字分享
        </a>
        <a
          role="tab"
          className={cn('tab', {
            'tab-active': activeTab === 'image',
          })}
          onClick={() => handleToggleTab('image')}
        >
          图片分享
        </a>
      </div>
      {activeTab === 'text' && <TextShare />}
      {activeTab === 'image' && <ImageShare />}

      <Turorial />
    </div>
  );
});
