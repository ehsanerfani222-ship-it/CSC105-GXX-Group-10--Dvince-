import { useLocation, useNavigate } from "react-router";
import { NAV_ITEMS, isNavItemActive } from "../config/navigation";

// Props allow the unread count to stay configurable.
// This keeps the component reusable and easier to test.
interface BottomNavProps {
  unreadChatCount?: number;
}

export default function BottomNav({
  unreadChatCount = 3,
}: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isNavItemActive(item.id, location.pathname);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                active ? "text-cyan-500" : "text-gray-600"
              }`}
            >
              <div className="relative">
                <Icon size={22} />

                {/* Only the chat item can show an unread badge */}
                {item.id === "chat" && unreadChatCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadChatCount > 9 ? "9+" : unreadChatCount}
                  </span>
                )}
              </div>

              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}