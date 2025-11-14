import React from 'react';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { Message as MessageType } from '../types';

const MarkdownContent: React.FC<{ text: string }> = ({ text }) => {
  const elements: React.ReactNode[] = [];
  const lines = text.split('\n');
  
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushList = (list: { type: 'ul' | 'ol'; items: string[] } | null, key: string | number) => {
    if (list) {
      const ListTag = list.type;
      const listStyle = ListTag === 'ol' ? 'list-decimal' : 'list-disc';
      elements.push(
        <ListTag key={`list-${key}`} className={`${listStyle} pl-6 my-2 space-y-1`}>
          {list.items.map((item, i) => <li key={i}>{item}</li>)}
        </ListTag>
      );
    }
    return null;
  };
  
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      currentList = flushList(currentList, index);
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} className="bg-gray-800 text-white p-4 rounded-md my-2 overflow-x-auto text-sm font-mono">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
      }
      return;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
    const ulMatch = line.match(/^\s*([*-])\s+(.*)/);

    if (ulMatch) {
      if (currentList?.type !== 'ul') currentList = flushList(currentList, `ul-${index}`);
      if (!currentList) currentList = { type: 'ul', items: [] };
      currentList.items.push(ulMatch[2]);
    } else if (olMatch) {
      if (currentList?.type !== 'ol') currentList = flushList(currentList, `ol-${index}`);
      if (!currentList) currentList = { type: 'ol', items: [] };
      currentList.items.push(olMatch[1]);
    } else {
      currentList = flushList(currentList, `p-${index}`);
      if (line.trim() !== '') {
        elements.push(<p key={`p-${index}`}>{line}</p>);
      }
    }
  });

  flushList(currentList, 'final');
  
  if (codeLines.length > 0) {
     elements.push(
        <pre key="final-code" className="bg-gray-800 text-white p-4 rounded-md my-2 overflow-x-auto text-sm font-mono">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
  }

  return <div className="space-y-2">{elements}</div>;
};


const Message: React.FC<MessageType & { isLoading?: boolean }> = ({ sender, text, citations, fileInfo, isError, isLoading, tokenCount }) => {
  const isAI = sender === 'ai';

  return (
    <div className={`flex items-start gap-4 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isAI ? 'bg-gray-200' : 'bg-blue-600'}`}>
        {isAI ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`w-full max-w-2xl px-5 py-4 rounded-lg shadow-md ${isAI ? 'bg-white border border-gray-200' : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'}`}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <div className={isError ? 'text-red-500' : ''}>
            {isAI ? <MarkdownContent text={text} /> : <p className="whitespace-pre-wrap">{text}</p>}
          </div>
        )}
        
        {fileInfo && (
            <div className="mt-3 border-t border-blue-400 pt-2">
                <p className="text-xs font-mono">
                    File attached: {fileInfo.name} ({(fileInfo.size / 1024).toFixed(2)} KB)
                </p>
            </div>
        )}
        
        {isAI && !isLoading && (
            <>
                {citations && citations.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-3">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Citations:</h4>
                    <ul className="space-y-1">
                      {citations.map((citation, index) => (
                        <li key={index} className="text-xs text-blue-600 hover:underline cursor-pointer">{citation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-xs text-gray-400 italic">The answer is provided by AI. Please be informed that AI may make mistakes.</p>
                    {tokenCount && <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{tokenCount} tokens</span>}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Message;