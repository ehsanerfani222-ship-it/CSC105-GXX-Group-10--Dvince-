import type { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

// Reusable page shell used across authenticated and public pages.
// It removes duplicated wrapper code like:
// - min-h-screen background
// - shared header
// - optional bottom nav
// - optional back button
// - repeated main container spacing
interface PageLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showBottomNav?: boolean;
  containerClassName?: string;
  mainClassName?: string;
  unreadChatCount?: number;
}

export default function PageLayout({
  children,
  showBackButton = false,
  onBackClick,
  showBottomNav = false,
  containerClassName = "min-h-screen bg-gray-50",
  mainClassName = "",
  unreadChatCount = 3,
}: PageLayoutProps) {
  return (
    <div
      className={`${containerClassName} ${
        showBottomNav ? "pb-20 lg:pb-0" : ""
      }`}
    >
      <Header showBackButton={showBackButton} onBackClick={onBackClick} />

      {/* The page content is injected here */}
      <main className={mainClassName}>{children}</main>

      {/* Mobile bottom navigation is optional */}
      {showBottomNav && <BottomNav unreadChatCount={unreadChatCount} />}
    </div>
  );
}