import { useLocation, useNavigate } from "react-router";
import logoImage from "../../assets/logo.png";
import { NAV_ITEMS, isAuthenticatedRoute, isNavItemActive } from "../config/navigation";

// Props for the reusable header component.
interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({
  showBackButton = false,
  onBackClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect whether we are inside the authenticated area of the app.
  const loggedIn = isAuthenticatedRoute(location.pathname);

  // Clicking the logo should send the user to the correct landing route.
  const handleLogoClick = () => {
    navigate(loggedIn ? "/search" : "/");
  };

  return (
    <header className="bg-white shadow-sm px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center min-w-0">
        {/* Optional back button for pages that need custom back navigation */}
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Shared logo button */}
        <button onClick={handleLogoClick} aria-label="Go to home">
          <img
            src={logoImage}
            alt="Dvince Logo"
            className="h-10 md:h-12 lg:h-14 w-auto scale-130 origin-left hover:opacity-80 transition"
          />
        </button>
      </div>

      {/* Desktop navigation only for logged-in routes */}
      {loggedIn && (
        <nav className="hidden lg:flex items-center gap-3" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item.id, location.pathname);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  active
                    ? "bg-cyan-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}