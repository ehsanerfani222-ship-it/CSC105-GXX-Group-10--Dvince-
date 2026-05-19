import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import PageLayout from '../components/PageLayout';
import { api } from '../lib/api';
import AnimatedAvatar from '../components/AnimatedAvatar';

interface ChatListItem {
  partnerId: number;
  fullName: string;
  username: string;
  profilePicture?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export default function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<any[]>('/chats');

        setChats(
          data.map((c) => ({
            // ✅ FIXED HERE
            partnerId: c.partnerId ?? c.partner?.id ?? c.userId ?? c.id,

            fullName: c.partner?.name || c.fullName || 'User',

            username: c.partner?.username || c.username || '',

            profilePicture:
              c.partner?.profilePicture || c.profilePicture || '',

            lastMessage: c.lastMessage || '',

            timestamp: c.timestamp
              ? new Date(c.timestamp).toLocaleString()
              : c.lastMessageAt
              ? new Date(c.lastMessageAt).toLocaleString()
              : '',

            unread: c.unread || 0,
          }))
        );
      } catch (e: any) {
        setError(e.message || 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PageLayout
      showBottomNav
      mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Messages
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading...
            </div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              You have not started any chats yet.
            </div>
          ) : (
            chats.map((chat, index) => (
              <div
                key={chat.partnerId}
                onClick={() =>
                  navigate(`/chat/${chat.partnerId}`, {
                    state: { from: '/chat' },
                  })
                }
                className={`p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  index !== chats.length - 1
                    ? 'border-b border-gray-200'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <AnimatedAvatar
                    name={chat.fullName}
                    imageUrl={chat.profilePicture}
                    size="lg"
                    className="flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-bold text-gray-900 truncate">
                        {chat.fullName}
                      </h3>

                      <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                        {chat.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-cyan-500 mb-2">
                      {chat.username}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 truncate flex-1">
                        {chat.lastMessage}
                      </p>

                      {chat.unread > 0 && (
                        <span className="ml-2 bg-cyan-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
