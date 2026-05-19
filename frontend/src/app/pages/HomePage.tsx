import { useEffect, useState } from "react";
import { PlusSquare } from "lucide-react";
import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import PostCard, { type Post } from "../components/PostCard";
import AnimatedAvatar from "../components/AnimatedAvatar";
import type { Profile } from "../data/mockData";
import { api, mapApiUser } from "../lib/api";

export default function HomePage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedPeople, setSuggestedPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = Number(localStorage.getItem("userId"));

  const fetchFeed = async () => {
    try {
      const data = await api.get<Post[]>("/posts");
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load feed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await api.get<any[]>("/search");
      const suggestions = (Array.isArray(data) ? data : [])
        .map(mapApiUser)
        .filter((person) => person.id !== currentUserId)
        .slice(0, 5);

      setSuggestedPeople(suggestions);
    } catch (err) {
      console.error("Failed to load suggestions", err);
    }
  };

  useEffect(() => {
    fetchFeed();
    fetchSuggestions();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      await api.post(`/posts/${postId}/like`);
      fetchFeed();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      fetchFeed();
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

  if (loading) {
    return (
      <PageLayout showBottomNav>
        <div className="flex items-center justify-center py-20 text-gray-500">
          Loading feed...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBottomNav mainClassName="bg-gray-100 min-h-screen">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/create-post")}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full font-medium transition"
            aria-label="Create post"
          >
            <PlusSquare className="w-5 h-5" />
            Create Post
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                No Posts Yet
              </h2>

              <p className="text-gray-500 mb-4">
                Be the first person to create a post.
              </p>

              <button
                type="button"
                onClick={() => navigate("/create-post")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full transition"
              >
                Create Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDeletePost}
                onProfileClick={(userId) =>
                  navigate(`/user/${userId}`, { state: { from: "/home" } })
                }
              />
            ))
          )}
        </div>

        <aside>
          <div className="lg:sticky lg:top-20 bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Suggested people
              </h2>
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
              >
                See all
              </button>
            </div>

            {suggestedPeople.length === 0 ? (
              <p className="text-sm text-gray-500">
                No suggestions available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {suggestedPeople.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() =>
                      navigate(`/user/${person.id}`, { state: { from: "/home" } })
                    }
                    className="w-full flex items-center gap-3 text-left"
                  >
                    <AnimatedAvatar
                      name={person.fullName}
                      imageUrl={person.profilePicture}
                      size="sm"
                      className="flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {person.fullName || "Unnamed user"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        @{person.username || "user"}
                      </p>
                      {person.skills[0] && (
                        <p className="text-xs text-cyan-600 truncate">
                          {person.skills[0].subCategory || person.skills[0].name}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
