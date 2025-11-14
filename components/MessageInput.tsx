import React, { useState, useRef } from 'react';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { SendIcon } from './icons/SendIcon';
import { useLocalization } from '../context/LocalizationContext';

interface MessageInputProps {
  onSend: (text: string, file?: File) => void;
  disabled?: boolean;
  userTier: 'free' | 'basic' | 'pro';
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled, userTier }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocalization();

  const handleSend = () => {
    if ((text.trim() || file) && !disabled) {
      onSend(text.trim(), file || undefined);
      setText('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const estimatedTokens = Math.ceil(text.length / 4);

  return (
    <div className="px-4">
        <div className="relative">
          {file && (
             <div className="absolute bottom-full left-0 right-0 p-2 bg-gray-100 border-t border-b border-gray-200">
                <div className="flex items-center justify-between bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1.5 rounded-full">
                    <span>{file.name}</span>
                    <button onClick={() => setFile(null)} className="ml-2 text-blue-600 hover:text-blue-800">&times;</button>
                </div>
            </div>
          )}
          <div className="flex items-end gap-2 p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed self-center"
              aria-label="Attach file"
              disabled={disabled || userTier === 'free'}
              title={userTier === 'free' ? "Upgrade to enable file uploads" : "Attach file"}
            >
              <PaperclipIcon />
            </button>
            <input 
              type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden"
              accept=".pdf,.docx,.txt,.jpg,.png" disabled={disabled || userTier === 'free'}
            />
            <textarea
              value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={t('message_input_placeholder')}
              className="w-full resize-none border-0 focus:ring-0 p-0 bg-transparent text-gray-800 placeholder-gray-500 disabled:bg-gray-100"
              rows={1} disabled={disabled}
            />
            <button 
              onClick={handleSend} disabled={disabled || (!text.trim() && !file)}
              className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors self-end"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
        {text.length > 0 && <p className="text-xs text-gray-500 text-right mt-1.5 pr-2">Est. tokens: ~{estimatedTokens}</p>}
    </div>
  );
};

export default MessageInput;