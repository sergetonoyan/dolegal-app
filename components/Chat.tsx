import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { ChatSession, User } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface ChatProps {
  chats: ChatSession[];
  activeChat: ChatSession;
  onSendMessage: (text: string, file?: File) => void;
  isLoading: boolean;
  error: string | null;
  isBlocked: boolean;
  openAuthModal: () => void;
  user: User;
  navigateToLanding: () => void;
  setActiveChatId: (id: string) => void;
  createNewChat: () => void;
  renameChat: (id: string, newTitle: string) => void;
  pinChat: (id: string) => void;
  deleteChat: (id: string) => void;
}

const RegistrationBlocker: React.FC<{ openAuthModal: () => void }> = ({ openAuthModal }) => {
    const { t } = useLocalization();
    return (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-20">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('blocker_title')}</h3>
                <p className="text-gray-600 mb-6">{t('blocker_desc')}</p>
                <button
                    onClick={openAuthModal}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    {t('blocker_cta')}
                </button>
            </div>
        </div>
    );
};

const Chat: React.FC<ChatProps> = (props) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        chats={props.chats}
        activeChatId={props.activeChat.id}
        setActiveChatId={props.setActiveChatId}
        createNewChat={props.createNewChat}
        renameChat={props.renameChat}
        pinChat={props.pinChat}
        deleteChat={props.deleteChat}
        user={props.user}
        navigateToLanding={props.navigateToLanding}
      />
      <div className="relative flex-1 flex flex-col">
          {props.isBlocked && <RegistrationBlocker openAuthModal={props.openAuthModal} />}
          <ChatArea 
            messages={props.activeChat.messages} 
            onSendMessage={props.onSendMessage}
            isLoading={props.isLoading}
            error={props.error}
            disabled={props.isBlocked}
            userTier={props.user.tier}
          />
      </div>
    </div>
  );
};

export default Chat;