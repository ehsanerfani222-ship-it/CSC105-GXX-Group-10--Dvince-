import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import PageLayout from '../components/PageLayout';
import { getChatListItems } from '../data/chatStorage';

export default function ChatList() {
  const navigate = useNavigate();

  const chats = useMemo(() => getChatListItems(), []);

  return (
    <PageLayout
      showBottomNav
      mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Messages
        </h2>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {chats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`, { state: { from: '/chat' } })}
              className={`p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors ${index !== chats.length - 1 ? 'border-b border-gray-200' : ''
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{chat.fullName}</h3>
                    <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>

                  <p className="text-sm text-cyan-500 mb-2">{chat.username}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-cyan-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}