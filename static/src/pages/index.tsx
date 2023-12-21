import { useState, memo } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import TextShare from '../components/text-share';
import FileShare from '../components/file-share';
import Turorial from '../components/tutorial';

export default memo(function CreatePaste() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');

  const handleToggleTab = (tab: 'text' | 'file') => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 md:p-10 flex flex-col gap-3 mx-auto max-w-7xl">
      <div role="tablist" className="tabs tabs-boxed">
        <a
          role="tab"
          className={cn('tab', {
            'tab-active': activeTab === 'text',
          })}
          onClick={() => handleToggleTab('text')}
        >
          {t('textShare')}
        </a>
        <a
          role="tab"
          className={cn('tab', {
            'tab-active': activeTab === 'file',
          })}
          onClick={() => handleToggleTab('file')}
        >
          {t('fileShare')}
        </a>
      </div>
      {activeTab === 'text' && <TextShare />}
      {activeTab === 'file' && <FileShare />}
      <Turorial />
    </div>
  );
});
