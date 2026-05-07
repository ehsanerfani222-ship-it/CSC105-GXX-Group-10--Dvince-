import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Send } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { findProfile } from '../data/mockData';

export default function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get current user ID (must be stored during login)
  const currentUserId = Number(localStorage.getItem("userId"));

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/chat');
  };

  const partner = useMemo(() => findProfile(String(userId)), [userId]);

  // ✅ Fetch messages
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        navigate('/');
        return;
      }

      const data = await res.json();

      const formatted = data.map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderId === currentUserId ? 'me' : 'them',
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMessages(formatted);

    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  // ✅ Send message
  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const tempMessage = {
      id: Date.now(),
      text: trimmed,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // ✅ Instant UI update
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: trimmed,
          receiverId: userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Message send failed");
      }

      // ✅ Optional: sync with backend (keeps IDs accurate)
      fetchMessages();

    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 lg:pb-0">
      <Header showBackButton onBackClick={handleBack} />

      {/* Header */}
      <div className="bg-white shadow-sm px-4 md:px-6 lg:px-8 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {partner?.fullName || "User"}
            </h3>
            <p className="text-sm text-cyan-500">
              {partner?.username || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
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
                className={`flex ${
                  message.sender === 'me' ? 'justify-end' : 'justify-start'
                }`}
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
                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'me'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Input */}
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
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}