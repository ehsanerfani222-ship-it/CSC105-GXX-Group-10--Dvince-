// Central place for navigation configuration.
// Both Header and BottomNav use the same source of truth,
// so labels, routes and active-state rules stay consistent.

import { MessageCircle, Search, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Supported navigation item ids.
export type NavItemId = "search" | "chat" | "profile";

// Shared navigation item shape.
export interface NavItem {
  id: NavItemId;
  label: string;
  path: string;
  icon: LucideIcon;
}

// Shared navigation items for desktop header and mobile bottom navigation.
export const NAV_ITEMS: NavItem[] = [
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

// Returns true when the current route should be treated as authenticated.
// This is used to decide whether the header should show app navigation.
export function isAuthenticatedRoute(pathname: string): boolean {
  return pathname !== "/" && pathname !== "/login";
}

// Returns true if a navigation item should be highlighted for the current route.
export function isNavItemActive(itemId: NavItemId, pathname: string): boolean {
  switch (itemId) {
    case "search":
      return pathname.startsWith("/search") || pathname.startsWith("/user/");
    case "chat":
      return pathname.startsWith("/chat");
    case "profile":
      return pathname.startsWith("/profile") || pathname.startsWith("/my-skills");
    default:
      return false;
  }
}