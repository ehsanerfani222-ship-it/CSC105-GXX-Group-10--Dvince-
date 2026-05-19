import {
  Home,
  Search,
  MessageCircle,
  User,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    path: "/home",
    icon: Home,
  },
  {
    id: "search",
    label: "Search",
    path: "/search",
    icon: Search,
  },
  {
    id: "chat",
    label: "Chats",
    path: "/chat",
    icon: MessageCircle,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    icon: User,
  },
];

// ✅ Detect authenticated routes
export function isAuthenticatedRoute(pathname: string) {
  return [
    "/home",
    "/search",
    "/chat",
    "/profile",
    "/create-profile",
    "/create-post",
    "/add-skill",
    "/my-skills",
    "/user",
  ].some((route) => pathname.startsWith(route));
}

// ✅ Active nav logic
export function isNavItemActive(id: string, pathname: string) {
  switch (id) {
    case "home":
      return pathname === "/home";

    case "search":
      return pathname.startsWith("/search");

    case "chat":
      return pathname.startsWith("/chat");

    case "profile":
      return (
        pathname.startsWith("/profile") ||
        pathname.startsWith("/user")
      );

    default:
      return false;
  }
}
