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
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreatePost from "./pages/CreatePost";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import type { ReactElement } from "react";

// Small helper to avoid repeating <ProtectedRoute>...</ProtectedRoute>
function withProtectedRoute(element: ReactElement): ReactElement {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

// Small helper to avoid repeating <PublicOnlyRoute>...</PublicOnlyRoute>
function withPublicOnlyRoute(element: ReactElement): ReactElement {
  return <PublicOnlyRoute>{element}</PublicOnlyRoute>;
}

export const router = createBrowserRouter([
  // =========================
  // PUBLIC ROUTES
  // =========================
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/login",
    element: withPublicOnlyRoute(<LoginRegister />),
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  // =========================
  // PROTECTED ROUTES
  // =========================
  {
    path: "/home",
    element: withProtectedRoute(<HomePage />),
  },

  {
    path: "/create-post",
    element: withProtectedRoute(<CreatePost />),
  },

  {
    path: "/create-profile",
    element: withProtectedRoute(<CreateProfile />),
  },

  {
    path: "/add-skill",
    element: withProtectedRoute(<AddSkill />),
  },

  {
    path: "/profile",
    element: withProtectedRoute(<ViewOwnProfile />),
  },

  {
    path: "/my-skills",
    element: withProtectedRoute(<ViewOwnSkills />),
  },

  {
    path: "/search",
    element: withProtectedRoute(<SearchPage />),
  },

  {
    path: "/user/:id",
    element: withProtectedRoute(<ViewUserProfile />),
  },

  {
    path: "/user/:id/skills",
    element: withProtectedRoute(<ViewUserSkills />),
  },

  {
    path: "/chat",
    element: withProtectedRoute(<ChatList />),
  },

  {
    path: "/chat/:id",
    element: withProtectedRoute(<Chat />),
  },

  // =========================
  // FALLBACK ROUTE
  // =========================
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);