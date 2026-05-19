import { useState } from "react";
import { useNavigate } from "react-router";
import { Image, Video, ArrowLeft } from "lucide-react";

export default function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [previewImage, setPreviewImage] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");

  const [loading, setLoading] = useState(false);

  // IMAGE UPLOAD
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      setImageUrl(result);
      setPreviewImage(result);

      // remove video if image selected
      setVideoUrl("");
      setPreviewVideo("");
    };

    reader.readAsDataURL(file);
  };

  // VIDEO UPLOAD
  const handleVideoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      setVideoUrl(result);
      setPreviewVideo(result);

      // remove image if video selected
      setImageUrl("");
      setPreviewImage("");
    };

    reader.readAsDataURL(file);
  };

  // CREATE POST
  const handleCreatePost = async () => {
    if (!caption && !imageUrl && !videoUrl) {
      alert("Please add something to post");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            caption,
            imageUrl,
            videoUrl,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      navigate("/home");
    } catch (err) {
      console.error(err);

      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* TOP BAR */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft />
          </button>

          <h1 className="text-xl font-bold text-gray-900">
            Create Post
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow p-5">
          {/* CAPTION */}
          <textarea
            value={caption}
            onChange={(e) =>
              setCaption(e.target.value)
            }
            placeholder="What's on your mind?"
            className="w-full min-h-[120px] border border-gray-300 rounded-2xl p-4 resize-none outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* PREVIEW */}
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full mt-4 rounded-2xl max-h-[500px] object-cover"
            />
          )}

          {previewVideo && (
            <video
              controls
              className="w-full mt-4 rounded-2xl max-h-[500px]"
            >
              <source
                src={previewVideo}
                type="video/mp4"
              />
            </video>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-5">
            {/* IMAGE */}
            <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-3 rounded-xl cursor-pointer">
              <Image size={20} />

              <span>Add Image</span>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>

            {/* VIDEO */}
            <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-3 rounded-xl cursor-pointer">
              <Video size={20} />

              <span>Add Video</span>

              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoUpload}
              />
            </label>
          </div>

          {/* POST BUTTON */}
          <button
            onClick={handleCreatePost}
            disabled={loading}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold py-3 rounded-2xl"
          >
            {loading ? "Posting..." : "Share Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
