import React, { useState, useCallback } from 'react';
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
  
  const createNewChat = useCallback((): ChatSession => ({
    id: `chat_${Date.now()}`,
    title: 'New Chat',
    messages: [{ sender: 'ai', text: 'Hello! I am your AI assistant. How can I help you with Armenian legislation today?', citations: [] }],
    pinned: false
  }), []);

  const [chats, setChats] = useState<ChatSession[]>([createNewChat()]);
  const [activeChatId, setActiveChatId] = useState<string>(chats[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigateToChat = () => setView('chat');
  const navigateToLanding = () => setView('landing');
  const openAuthModal = (type: AuthModalType) => { setAuthModalType(type); setAuthModalOpen(true); };
  
  const handleCreateNewChat = () => {
    const newChat = createNewChat();
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  const renameChat = (chatId: string, newTitle: string) => setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
  const pinChat = (chatId: string) => setChats(prev => prev.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c));

  const deleteChat = (chatId: string) => {
    const remainingChats = chats.filter(c => c.id !== chatId);
    if (remainingChats.length > 0) {
      setChats(remainingChats);
      if (activeChatId === chatId) setActiveChatId(remainingChats[0].id);
    } else {
      const newChat = createNewChat();
      setChats([newChat]);
      setActiveChatId(newChat.id);
    }
  };

  const handleSendMessage = useCallback(async (text: string, file?: File) => {
    if (!activeChatId) return;
    if (user.tier === 'free' && freeRequestsLeft <= 0) { openAuthModal('signup'); return; }

    const userMessage: Message = { sender: 'user', text };
    const isFirstUserMessage = chats.find(c => c.id === activeChatId)?.messages.filter(m => m.sender === 'user').length === 0;

    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMessage] } : c));
    setIsLoading(true);
    setError(null);
    if (user.tier === 'free') setFreeRequestsLeft(prev => prev - 1);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, isFirstUserMessage, chatId: activeChatId }),
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      const data = await response.json();

      if (data.newTitle) renameChat(activeChatId, data.newTitle);
      const aiResponse: Message = { sender: 'ai', text: data.responseText, citations: data.citations };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, aiResponse] } : c));
    } catch(e) {
      const errorResponse: Message = { sender: 'ai', text: 'Sorry, an error occurred.', citations: [], isError: true };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errorResponse] } : c));
    } finally {
      setIsLoading(false);
    }
  }, [user, freeRequestsLeft, activeChatId, chats]);
  
  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <LocalizationProvider>
        {view === 'landing' ? <LandingPage navigateToChat={navigateToChat} openAuthModal={openAuthModal} /> : activeChat && 
          <Chat {...{ chats, activeChat, onSendMessage: handleSendMessage, isLoading, error, isBlocked: user.tier === 'free' && freeRequestsLeft <= 0, openAuthModal: () => openAuthModal('signup'), user, navigateToLanding, setActiveChatId, createNewChat: handleCreateNewChat, renameChat, pinChat, deleteChat }} />}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} initialType={authModalType} />
    </LocalizationProvider>
  );
};
export default App;