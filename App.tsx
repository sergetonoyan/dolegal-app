import React, { useState, useCallback, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Chat from './components/Chat';
import AuthModal from './components/AuthModal';
import { LocalizationProvider } from './context/LocalizationContext';
import { Message, ChatSession, User } from './types';

type View = 'landing' | 'chat';
export type AuthModalType = 'login' | 'signup' | 'forgotPassword';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<AuthModalType>('login');
  
  const [user, setUser] = useState<User>({ isLoggedIn: false, tier: 'free' });
  const [freeRequestsLeft, setFreeRequestsLeft] = useState(3);
  
  const initialChatId = `chat_${Date.now()}`;
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: initialChatId,
      title: 'New Chat',
      messages: [{
        sender: 'ai',
        text: 'Hello! I am your AI assistant. How can I help you with Armenian legislation today?',
        citations: [],
      }],
      pinned: false
    }
  ]);
  const [activeChatId, setActiveChatId] = useState<string>(initialChatId);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigateToChat = () => setView('chat');
  const navigateToLanding = () => setView('landing');

  const openAuthModal = (type: AuthModalType) => {
    setAuthModalType(type);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Chat',
      messages: [{
        sender: 'ai',
        text: 'Hello! I am your AI assistant. How can I help you with Armenian legislation today?',
        citations: [],
      }],
      pinned: false
    };
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newChatId);
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat));
  };
  
  const pinChat = (chatId: string) => {
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat));
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => {
        const remainingChats = prev.filter(chat => chat.id !== chatId);
        if (activeChatId === chatId) {
            const nextChat = remainingChats.find(c => c.id !== chatId) || remainingChats[0];
            if (nextChat) {
                setActiveChatId(nextChat.id);
            } else {
                // This case should ideally not happen if we always ensure one chat exists
                // But as a fallback, we could create a new one.
                // For now, we'll just set activeId to null if no chats are left.
                setActiveChatId(null);
            }
        }
        return remainingChats.length > 0 ? remainingChats : [];
    });
  };
  
  // Create a new chat if all chats are deleted
  useEffect(() => {
    if (chats.length === 0) {
        createNewChat();
    }
  }, [chats]);

  
  const handleSendMessage = useCallback(async (text: string, file?: File) => {
    if (user.tier === 'free' && freeRequestsLeft <= 0) {
      openAuthModal('signup');
      return;
    }
    
    if (file && user.tier === 'free') {
        setError("File uploads are not available on the Free plan. Please upgrade.");
        return;
    }

    const userMessage: Message = { sender: 'user', text };
    if (file) {
      userMessage.fileInfo = { name: file.name, size: file.size };
    }

    const activeChat = chats.find(c => c.id === activeChatId);
    const isFirstUserMessage = activeChat ? activeChat.messages.filter(m => m.sender === 'user').length === 0 : false;

    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] } 
        : chat
    ));

    setIsLoading(true);
    setError(null);

    if (user.tier === 'free') {
      setFreeRequestsLeft(prev => prev - 1);
    }
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          isFirstUserMessage: isFirstUserMessage,
          chatId: activeChatId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.newTitle) renameChat(activeChatId, data.newTitle);
      
      const aiResponse: Message = {
          sender: 'ai',
          text: data.responseText,
          citations: data.citations,
          tokenCount: Math.floor(Math.random() * 500) + 50 // Mock token count
      };
        
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, aiResponse] } 
          : chat
      ));

    } catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to get response: ${errorMessage}`);
        const errorResponse: Message = {
            sender: 'ai',
            text: 'Sorry, an error occurred. Please check your connection or try again later.',
            citations: [], isError: true,
        };
        setChats(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: [...chat.messages, errorResponse] } 
            : chat
        ));
    } finally {
        setIsLoading(false);
    }
  }, [user, freeRequestsLeft, activeChatId, chats]);
  
  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <LocalizationProvider>
      <div className="font-sans antialiased text-gray-800">
        {view === 'landing' && (
          <LandingPage 
            navigateToChat={navigateToChat}
            openAuthModal={openAuthModal}
          />
        )}
        {view === 'chat' && activeChat && (
          <Chat
            chats={chats}
            activeChat={activeChat}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
            isBlocked={user.tier === 'free' && freeRequestsLeft <= 0}
            openAuthModal={() => openAuthModal('signup')}
            user={user}
            navigateToLanding={navigateToLanding}
            setActiveChatId={setActiveChatId}
            createNewChat={createNewChat}
            renameChat={renameChat}
            pinChat={pinChat}
            deleteChat={deleteChat}
          />
        )}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialType={authModalType}
        />
      </div>
    </LocalizationProvider>
  );
};

export default App;