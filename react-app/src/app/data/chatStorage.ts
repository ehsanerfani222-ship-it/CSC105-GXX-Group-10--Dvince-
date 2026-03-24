import { getCurrentUserEmail } from './appStorage';
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

// Base key for per-user chat storage.
const CHAT_STORAGE_KEY_PREFIX = 'dvince_chat_conversations';

// This chat is always available for every logged-in user.
// It is shown in addition to the chats stored for that user.
const DEFAULT_CHAT: ChatConversation = {
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
};

// Safely reads JSON from localStorage.
function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// Build a user-specific chat storage key.
// Every logged-in user gets their own isolated chat storage.
function getChatStorageKey(): string | null {
  const email = getCurrentUserEmail();
  if (!email) return null;

  return `${CHAT_STORAGE_KEY_PREFIX}_${email}`;
}

// Save only the user-created / user-updated chats for the current user.
function saveStoredChats(chats: ChatConversation[]) {
  const key = getChatStorageKey();
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(chats));
}

// Read only the stored chats for the current user.
function getStoredChats(): ChatConversation[] {
  const key = getChatStorageKey();
  if (!key) return [];

  return readJson<ChatConversation[]>(key) ?? [];
}

// Merge the default chat with stored chats.
// If the user has already updated the default chat and it exists in storage,
// the stored version wins so the chat is not duplicated.
function mergeDefaultChatWithStoredChats(
  storedChats: ChatConversation[]
): ChatConversation[] {
  const hasStoredVersionOfDefaultChat = storedChats.some(
    (chat) => chat.userId === DEFAULT_CHAT.userId
  );

  if (hasStoredVersionOfDefaultChat) {
    return storedChats;
  }

  return [DEFAULT_CHAT, ...storedChats];
}

// Return all chats visible to the current user.
// This always includes the default chat plus the user's stored chats.
export function getChats(): ChatConversation[] {
  const storedChats = getStoredChats();
  return mergeDefaultChatWithStoredChats(storedChats);
}

// Return one chat by partner user id.
export function getChatByUserId(userId: number): ChatConversation | null {
  const chats = getChats();
  return chats.find((chat) => chat.userId === userId) ?? null;
}

// Return an existing chat or create a new empty one for this partner.
// New chats are stored only in the user's own storage.
export function getOrCreateChatByUserId(userId: number): ChatConversation {
  const existing = getChatByUserId(userId);
  if (existing) return existing;

  const storedChats = getStoredChats();

  const newChat: ChatConversation = {
    id: Date.now(),
    userId,
    lastMessage: '',
    timestamp: '',
    unread: 0,
    messages: [],
  };

  const nextChats = [newChat, ...storedChats];
  saveStoredChats(nextChats);

  return newChat;
}

// Add a message to a chat for the current user.
// If the target is the default chat, we create/update a stored copy of it
// so user changes persist without mutating the hardcoded default object.
export function addMessageToChat(userId: number, text: string) {
  const storedChats = getStoredChats();
  const existingStoredChat = storedChats.find((chat) => chat.userId === userId);
  const visibleExistingChat = getChatByUserId(userId);

  const timestamp = 'Just now';

  // If no stored chat exists yet, create one.
  // For the default chat, we start from its visible content and store
  // an updated copy so future changes are persistent for this user.
  if (!existingStoredChat) {
    const baseMessages = visibleExistingChat?.messages ?? [];

    const newChat: ChatConversation = {
      id: visibleExistingChat?.id ?? Date.now(),
      userId,
      lastMessage: text,
      timestamp,
      unread: 0,
      messages: [
        ...baseMessages,
        {
          id: baseMessages.length + 1,
          text,
          sender: 'me',
          timestamp,
        },
      ],
    };

    saveStoredChats([newChat, ...storedChats]);
    return;
  }

  // Update existing stored chat.
  const updatedStoredChats = storedChats.map((chat) => {
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
    updatedStoredChats.find((chat) => chat.userId === userId)!,
    ...updatedStoredChats.filter((chat) => chat.userId !== userId),
  ];

  saveStoredChats(sortedChats);
}

// Mark one chat as read for the current user.
// If the user opens the default chat, we store a user-specific copy with unread = 0
// so the read state persists for that user.
export function markChatAsRead(userId: number) {
  const storedChats = getStoredChats();
  const existingStoredChat = storedChats.find((chat) => chat.userId === userId);
  const visibleExistingChat = getChatByUserId(userId);

  if (!visibleExistingChat) return;

  // If the chat is not in storage yet but exists as the default chat,
  // create a stored copy with unread reset to 0.
  if (!existingStoredChat) {
    saveStoredChats([
      {
        ...visibleExistingChat,
        unread: 0,
      },
      ...storedChats,
    ]);
    return;
  }

  const updatedStoredChats = storedChats.map((chat) =>
    chat.userId === userId ? { ...chat, unread: 0 } : chat
  );

  saveStoredChats(updatedStoredChats);
}

// Return chat list items for rendering in the chat overview.
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