import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Send } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { findProfile } from '../data/mockData';
import {
  addMessageToChat,
  getChatByUserId,
  markChatAsRead,
  type ChatMessage,
} from '../data/chatStorage';

export default function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);
  const [newMessage, setNewMessage] = useState('');

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/chat');
    }
  };

  const partner = useMemo(() => findProfile(String(userId)), [userId]);

  // Load existing messages if the chat already exists.
  // Do not auto-create a chat just by opening the page.
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const chat = getChatByUserId(userId);
    return chat?.messages ?? [];
  });

  useEffect(() => {
    const chat = getChatByUserId(userId);
    setMessages(chat?.messages ?? []);
    markChatAsRead(userId);
  }, [userId]);

  // Create the chat only when the first real message is sent.
  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    addMessageToChat(userId, trimmed);

    const updatedChat = getChatByUserId(userId);
    setMessages(updatedChat?.messages ?? []);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 lg:pb-0">
      <Header showBackButton onBackClick={handleBack} />

      <div className="bg-white shadow-sm px-4 md:px-6 lg:px-8 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{partner.fullName}</h3>
            <p className="text-sm text-cyan-500">{partner.username}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[75%] md:max-w-[60%]">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'me'
                        ? 'bg-cyan-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 shadow-md rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm md:text-base">{message.text}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="bg-white border-t border-gray-200 px-4 md:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          />
          <button
            onClick={handleSendMessage}
            className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}