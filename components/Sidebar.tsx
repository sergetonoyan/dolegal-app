import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, User } from '../types';
import { Logo } from './icons/Logo';
import { useLocalization } from '../context/LocalizationContext';
import { PinIcon } from './icons/PinIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SidebarProps {
    chats: ChatSession[];
    activeChatId: string;
    setActiveChatId: (id: string) => void;
    createNewChat: () => void;
    renameChat: (id: string, newTitle: string) => void;
    pinChat: (id: string) => void;
    deleteChat: (id: string) => void;
    user: User;
    navigateToLanding: () => void;
}

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLocalization();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    if (!user.isLoggedIn) {
        return (
             <div className="flex items-center p-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">G</span>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800">Guest User</p>
                </div>
            </div>
        )
    }

    // This is now a more generic placeholder for any logged-in user
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full text-left hover:bg-gray-100 p-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">RU</span>
                </div>
                <div className="ml-3 flex-grow">
                    <p className="text-sm font-semibold text-gray-800">Registered User</p>
                    <p className="text-xs text-gray-500">Basic Plan</p>
                </div>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                        <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('profile_upgrade')}</a></li>
                        <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('profile_buy_tokens')}</a></li>
                        <li><hr className="my-1 border-gray-200" /></li>
                        <li><a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">{t('profile_logout')}</a></li>
                    </ul>
                </div>
            )}
        </div>
    )
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocalization();

  useEffect(() => {
    if (renamingChatId && renameInputRef.current) {
        renameInputRef.current.focus();
    }
  }, [renamingChatId]);

  const handleRenameStart = (chat: ChatSession) => {
    setRenamingChatId(chat.id);
    setTempTitle(chat.title);
  }

  const handleRenameConfirm = () => {
    if (renamingChatId && tempTitle.trim()) {
        props.renameChat(renamingChatId, tempTitle.trim());
    }
    setRenamingChatId(null);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameConfirm();
    else if (e.key === 'Escape') setRenamingChatId(null);
  }

  const filteredChats = props.chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const pinnedChats = filteredChats.filter(c => c.pinned);
  const historyChats = filteredChats.filter(c => !c.pinned);


  const HistoryItem: React.FC<{ chat: ChatSession }> = ({ chat }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <li
            className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer truncate ${props.activeChatId === chat.id ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => props.setActiveChatId(chat.id)}
            onDoubleClick={() => handleRenameStart(chat)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {renamingChatId === chat.id ? (
                <input
                    ref={renameInputRef} type="text" value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleRenameConfirm} onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-0 border-b-2 border-blue-500 focus:ring-0 p-0"
                />
            ) : (
                <span className="truncate flex-grow">{chat.title}</span>
            )}
            {isHovered && renamingChatId !== chat.id && (
                <div className="flex-shrink-0 flex items-center gap-1 ml-2">
                    <button onClick={(e) => { e.stopPropagation(); props.pinChat(chat.id); }} className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-300">
                        <PinIcon filled={chat.pinned} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); props.deleteChat(chat.id); }} className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-300">
                        <TrashIcon />
                    </button>
                </div>
            )}
        </li>
    );
  };

  const LogoWrapper = props.user.isLoggedIn
    ? 'div' 
    : (({ children }: {children: React.ReactNode}) => <button onClick={props.navigateToLanding}>{children}</button>);

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="mb-4">
        <LogoWrapper><Logo /></LogoWrapper>
      </div>
      <button 
        onClick={props.createNewChat}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mb-4"
      >
        + {t('new_chat_title')}
      </button>

      <div className="mb-4 relative">
        <input 
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4">
        {pinnedChats.length > 0 && (
            <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pinned</h3>
                <ul className="space-y-1">{pinnedChats.map(chat => <HistoryItem key={chat.id} chat={chat} />)}</ul>
            </div>
        )}
        <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">History</h3>
            <ul className="space-y-1">{historyChats.map(chat => <HistoryItem key={chat.id} chat={chat} />)}</ul>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <UserProfile user={props.user} />
      </div>
    </div>
  );
};

export default Sidebar;