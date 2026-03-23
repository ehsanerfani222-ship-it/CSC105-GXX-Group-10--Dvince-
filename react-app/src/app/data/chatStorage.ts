import { findProfile } from './mockData';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export interface ChatConversation {
  id: number;
  userId: number;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: ChatMessage[];
}

const CHAT_STORAGE_KEY = 'dvince_chat_conversations';

const defaultChats: ChatConversation[] = [
  {
    id: 1,
    userId: 1,
    lastMessage: 'Thanks for the guitar lesson!',
    timestamp: '2 hours ago',
    unread: 2,
    messages: [
      {
        id: 1,
        text: 'Hi! I saw you teach guitar. Are you available for lessons?',
        sender: 'me',
        timestamp: '10:30 AM',
      },
      {
        id: 2,
        text: 'Hello! Yes, I am. What level are you at?',
        sender: 'them',
        timestamp: '10:32 AM',
      },
      {
        id: 3,
        text: "I'm a complete beginner. Is that okay?",
        sender: 'me',
        timestamp: '10:33 AM',
      },
      {
        id: 4,
        text: 'Absolutely! I love teaching beginners. When would you like to start?',
        sender: 'them',
        timestamp: '10:35 AM',
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    lastMessage: 'See you tomorrow for Spanish practice',
    timestamp: '5 hours ago',
    unread: 0,
    messages: [
      {
        id: 1,
        text: 'See you tomorrow for Spanish practice',
        sender: 'them',
        timestamp: '9:15 AM',
      },
    ],
  },
  {
    id: 3,
    userId: 3,
    lastMessage: 'Can we reschedule to next week?',
    timestamp: '1 day ago',
    unread: 1,
    messages: [
      {
        id: 1,
        text: 'Can we reschedule to next week?',
        sender: 'them',
        timestamp: 'Yesterday',
      },
    ],
  },
];

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveChats(chats: ChatConversation[]) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
}

export function getChats(): ChatConversation[] {
  const stored = readJson<ChatConversation[]>(CHAT_STORAGE_KEY);

  if (stored && stored.length > 0) {
    return stored;
  }

  saveChats(defaultChats);
  return defaultChats;
}

export function getChatByUserId(userId: number): ChatConversation | null {
  const chats = getChats();
  return chats.find((chat) => chat.userId === userId) ?? null;
}

export function getOrCreateChatByUserId(userId: number): ChatConversation {
  const existing = getChatByUserId(userId);
  if (existing) return existing;

  const chats = getChats();
  const profile = findProfile(String(userId));

  const newChat: ChatConversation = {
    id: Date.now(),
    userId,
    lastMessage: '',
    timestamp: '',
    unread: 0,
    messages: [],
  };

  const nextChats = [newChat, ...chats];
  saveChats(nextChats);

  return newChat;
}

export function addMessageToChat(userId: number, text: string) {
  const chats = getChats();
  const existing = chats.find((chat) => chat.userId === userId);

  const timestamp = 'Just now';

  if (!existing) {
    const newChat: ChatConversation = {
      id: Date.now(),
      userId,
      lastMessage: text,
      timestamp,
      unread: 0,
      messages: [
        {
          id: 1,
          text,
          sender: 'me',
          timestamp,
        },
      ],
    };

    saveChats([newChat, ...chats]);
    return;
  }

  const updatedChats = chats.map((chat) => {
    if (chat.userId !== userId) return chat;

    const nextMessage: ChatMessage = {
      id: chat.messages.length + 1,
      text,
      sender: 'me',
      timestamp,
    };

    return {
      ...chat,
      lastMessage: text,
      timestamp,
      unread: 0,
      messages: [...chat.messages, nextMessage],
    };
  });

  const sortedChats = [
    updatedChats.find((chat) => chat.userId === userId)!,
    ...updatedChats.filter((chat) => chat.userId !== userId),
  ];

  saveChats(sortedChats);
}

export function markChatAsRead(userId: number) {
  const chats = getChats();
  const updatedChats = chats.map((chat) =>
    chat.userId === userId ? { ...chat, unread: 0 } : chat
  );
  saveChats(updatedChats);
}

export function getChatListItems() {
  return getChats().map((chat) => {
    const profile = findProfile(String(chat.userId));

    return {
      id: chat.userId,
      username: profile.username,
      fullName: profile.fullName,
      lastMessage: chat.lastMessage || 'No messages yet',
      timestamp: chat.timestamp || '',
      unread: chat.unread,
    };
  });
}