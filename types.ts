export interface Message {
  sender: 'user' | 'ai';
  text: string;
  citations?: string[];
  fileInfo?: {
    name: string;
    size: number;
  };
  isError?: boolean;
  tokenCount?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  pinned: boolean;
}

export interface User {
  isLoggedIn: boolean;
  tier: 'free' | 'basic' | 'pro';
  // Add other user properties here later, e.g., name, email
}