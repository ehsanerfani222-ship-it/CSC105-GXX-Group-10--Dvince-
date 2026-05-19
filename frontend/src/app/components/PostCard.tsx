import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import AnimatedAvatar from "./AnimatedAvatar";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username?: string;
    profilePicture?: string;
  };
}

export interface Like {
  id: number;
  userId: number;
}

export interface Post {
  id: number;
  caption?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  userId: number;
  user: {
    id: number;
    name: string;
    username?: string;
    profilePicture?: string;
  };
  likes: Like[];
  comments: Comment[];
}

interface PostCardProps {
  post: Post;
  currentUserId: number;
  onLike: (postId: number) => void;
  onComment: (postId: number, content: string) => void;
  onDelete?: (postId: number) => void;
  onProfileClick?: (userId: number) => void;
}

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onComment,
  onDelete,
  onProfileClick,
}: PostCardProps) {
  const [commentInput, setCommentInput] = useState("");
  const liked = post.likes.some((like) => like.userId === currentUserId);
  const isOwner = post.userId === currentUserId;

  const handleCommentSubmit = () => {
    const content = commentInput.trim();
    if (!content) return;

    onComment(post.id, content);
    setCommentInput("");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Dvince Post",
        text: post.caption || "Check this out!",
      });
    } catch {
      console.log("Share cancelled");
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => onProfileClick?.(post.user.id)}
          className="flex-shrink-0"
          aria-label={`View ${post.user.name}'s profile`}
        >
          <AnimatedAvatar
            name={post.user.name}
            imageUrl={post.user.profilePicture}
            size="md"
          />
        </button>

        <button
          type="button"
          className="flex-1 min-w-0 text-left"
          onClick={() => onProfileClick?.(post.user.id)}
        >
          <h3 className="font-semibold text-gray-900 truncate">
            {post.user.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            @{post.user.username || "user"}
          </p>
        </button>

        {isOwner && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="p-2 rounded-full hover:bg-red-50 transition"
            aria-label="Delete post"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        )}
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full max-h-[700px] object-cover"
        />
      )}

      {post.videoUrl && (
        <video controls className="w-full max-h-[700px] bg-black">
          <source src={post.videoUrl} type="video/mp4" />
        </video>
      )}

      <div className="flex items-center gap-5 px-4 py-3">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          className="flex items-center gap-2"
          aria-label={liked ? "Unlike post" : "Like post"}
        >
          <Heart
            className={`transition ${
              liked ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
          <span className="text-sm font-medium">{post.likes.length}</span>
        </button>

        <div className="flex items-center gap-2">
          <MessageCircle className="text-gray-700" />
          <span className="text-sm font-medium">{post.comments.length}</span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="ml-auto"
          aria-label="Share post"
        >
          <Share2 className="text-gray-700" />
        </button>
      </div>

      {post.caption && (
        <div className="px-4 pb-3">
          <span className="font-semibold mr-2">
            @{post.user.username || "user"}
          </span>
          <span className="text-gray-800">{post.caption}</span>
        </div>
      )}

      {post.comments.length > 0 && (
        <div className="px-4 pb-3 space-y-2">
          {post.comments.map((comment) => (
            <div key={comment.id} className="text-sm">
              <span className="font-semibold mr-2">
                @{comment.user.username || "user"}
              </span>
              <span>{comment.content}</span>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommentSubmit();
              }
            }}
            className="flex-1 min-w-0 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="button"
            onClick={handleCommentSubmit}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 rounded-full text-sm font-medium transition"
          >
            Post
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 text-xs text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </div>
    </article>
  );
}
