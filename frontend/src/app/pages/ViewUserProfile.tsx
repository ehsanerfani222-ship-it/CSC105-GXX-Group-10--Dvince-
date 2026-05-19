import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Calendar, MapPin, MessageCircle } from "lucide-react";
import PageLayout from "../components/PageLayout";
import PostCard, { type Post } from "../components/PostCard";
import AnimatedAvatar from "../components/AnimatedAvatar";
import type { Profile } from "../data/mockData";
import { api, mapApiUser } from "../lib/api";

interface UserProfileLocationState {
  from?: string;
  searchState?: any;
}

export default function ViewUserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [user, setUser] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUserId = Number(localStorage.getItem("userId"));

  const navigationState = (location.state as UserProfileLocationState | null) ?? null;

  const fetchUserPosts = async (userId: number) => {
    const allPosts = await api.get<Post[]>("/posts");
    setPosts((Array.isArray(allPosts) ? allPosts : []).filter((post) => post.userId === userId));
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await api.get(`/users/${id}`);
        const mappedUser = mapApiUser(data);
        setUser(mappedUser);
        await fetchUserPosts(mappedUser.id);
      } catch (e: any) {
        setError(e.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBack = () => {
    navigate(navigationState?.from || "/home", {
      state: { searchState: navigationState?.searchState },
    });
  };

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

  const goToPostUser = (userId: number) => {
    if (userId === currentUserId) {
      navigate("/profile");
      return;
    }

    navigate(`/user/${userId}`);
  };

  if (loading) {
    return (
      <PageLayout showBackButton onBackClick={handleBack}>
        <div className="text-center py-10 text-gray-500">Loading...</div>
      </PageLayout>
    );
  }

  if (error || !user) {
    return (
      <PageLayout showBackButton onBackClick={handleBack}>
        <div className="text-center py-10 text-red-600">{error || "User not found"}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      showBottomNav
      showBackButton
      onBackClick={handleBack}
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
            <p className="text-cyan-500 mb-4">{user.username}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <Calendar className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">{user.dateOfBirth || "-"}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <MapPin className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">
                  {[user.city, user.country].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() =>
                navigate(`/user/${user.id}/skills`, {
                  state: {
                    from: navigationState?.from || "/home",
                    searchState: navigationState?.searchState,
                  },
                })
              }
              className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              View Skills
            </button>
            <button
              onClick={() => navigate(`/chat/${user.id}`, { state: { from: `/user/${user.id}` } })}
              className="flex-1 bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Message
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
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
              {user.fullName} has not shared any posts yet.
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDeletePost}
                  onProfileClick={goToPostUser}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
