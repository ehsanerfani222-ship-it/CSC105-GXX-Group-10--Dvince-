import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Calendar, Mail, MapPin, Phone, Edit, LogOut } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PostCard, { type Post } from "../components/PostCard";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AnimatedAvatar from "../components/AnimatedAvatar";

interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  city?: string;
  country?: string;
}

export default function ViewOwnProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async (userId: number) => {
    const allPosts = await api.get<Post[]>("/posts");
    setPosts((Array.isArray(allPosts) ? allPosts : []).filter((post) => post.userId === userId));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/");
          return;
        }

        const data = await res.json();

        setUser({
          id: data.id,
          fullName: data.name || "Unknown",
          username: data.username || data.email,
          email: data.email || "",
          profilePicture: data.profilePicture || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth || "",
          city: data.city || "",
          country: data.country || "",
        });

        if (data.id) {
          await fetchUserPosts(data.id);
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLike = async (postId: number) => {
    try {
      await api.post(`/posts/${postId}/like`);
      if (user) await fetchUserPosts(user.id);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      if (user) await fetchUserPosts(user.id);
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const confirmed = window.confirm("Delete this post?");
      if (!confirmed) return;

      await api.del(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <PageLayout showBottomNav>
        <div className="text-center py-10 text-gray-500">Loading profile...</div>
      </PageLayout>
    );
  }

  if (!user) return null;

  return (
    <PageLayout
      showBottomNav
      mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-8"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col items-center mb-8">
            <AnimatedAvatar
              name={user.fullName}
              imageUrl={user.profilePicture}
              size="xl"
              className="mb-4"
            />

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {user.fullName}
            </h2>
            <p className="text-cyan-500">{user.username}</p>
          </div>

          <div className="space-y-4">
            <InfoRow icon={<Mail size={20} className="text-gray-600" />} label="Email" value={user.email} />
            <InfoRow icon={<Phone size={20} className="text-gray-600" />} label="Phone Number" value={user.phoneNumber || ""} />
            <InfoRow icon={<Calendar size={20} className="text-gray-600" />} label="Date of Birth" value={user.dateOfBirth || ""} />
            <InfoRow icon={<MapPin size={20} className="text-gray-600" />} label="Location" value={[user.city, user.country].filter(Boolean).join(", ")} />
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/create-profile")}
                className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Edit
              </button>

              <button
                onClick={() => navigate("/my-skills")}
                className="flex-1 bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
              >
                View Skills
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Posts</h3>
            <span className="text-sm text-gray-500">
              {posts.length} post{posts.length === 1 ? "" : "s"}
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">No posts yet</h4>
              <p className="text-gray-500 mb-4">Share a photo or video from your profile.</p>
              <button
                type="button"
                onClick={() => navigate("/create-post")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full transition"
              >
                Create Post
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user.id}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDeletePost}
                  onProfileClick={() => navigate("/profile")}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value || "-"}</p>
      </div>
    </div>
  );
}
