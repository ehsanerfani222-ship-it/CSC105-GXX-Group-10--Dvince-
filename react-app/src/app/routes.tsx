import { createBrowserRouter, Navigate } from "react-router";

import LandingPage from "./pages/LandingPage";
import LoginRegister from "./pages/LoginRegister";
import CreateProfile from "./pages/CreateProfile";
import AddSkill from "./pages/AddSkill";
import ViewOwnProfile from "./pages/ViewOwnProfile";
import ViewOwnSkills from "./pages/ViewOwnSkills";
import SearchPage from "./pages/SearchPage";
import ViewUserProfile from "./pages/ViewUserProfile";
import ViewUserSkills from "./pages/ViewUserSkills";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

const RedirectToSearch = () => <Navigate to="/search" replace />;

export const router = createBrowserRouter([
  // PUBLIC
  { path: "/", Component: LandingPage },

  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginRegister />
      </PublicOnlyRoute>
    ),
  },

  // PROTECTED
  {
    path: "/create-profile",
    element: (
      <ProtectedRoute>
        <CreateProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-skill",
    element: (
      <ProtectedRoute>
        <AddSkill />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ViewOwnProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-skills",
    element: (
      <ProtectedRoute>
        <ViewOwnSkills />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <SearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/:id",
    element: (
      <ProtectedRoute>
        <ViewUserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/:id/skills",
    element: (
      <ProtectedRoute>
        <ViewUserSkills />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <ChatList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:id",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },

  // FALLBACK
  { path: "*", element: <Navigate to="/" replace /> },
]);