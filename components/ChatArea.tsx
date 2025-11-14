import React from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { Message as MessageType } from '../types';

interface ChatAreaProps {
  messages: MessageType[];
  onSendMessage: (text: string, file?: File) => void;
  isLoading: boolean;
  error: string | null;
  disabled?: boolean;
  userTier: 'free' | 'basic' | 'pro';
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, isLoading, error, disabled, userTier }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Legal Query Chat</h2>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-6">
            {messages.map((msg, index) => (
                <Message key={index} {...msg} />
            ))}
            {isLoading && <Message sender="ai" text="Typing..." citations={[]} isLoading={true} />}
            <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="bg-white p-4 border-t border-gray-200">
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <MessageInput onSend={onSendMessage} disabled={isLoading || disabled} userTier={userTier} />
      </footer>
    </div>
  );
};

export default ChatArea;