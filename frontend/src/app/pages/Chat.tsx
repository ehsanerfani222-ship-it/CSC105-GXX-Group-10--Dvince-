import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Camera,
  Image,
  Send,
  Trash2,
  Video,
  VideoIcon,
  X,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { api, mapApiUser } from "../lib/api";
import type { Profile } from "../data/mockData";
import AnimatedAvatar from "../components/AnimatedAvatar";

const reactions = ["👍", "❤️", "😂", "🔥", "👏", "😮"];

interface ChatMessage {
  id: number;
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  reaction?: string;
  sender: "me" | "them";
  timestamp: string;
}

interface MediaPreview {
  url: string;
  type: "image" | "video";
}

export default function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);
  const currentUserId = Number(localStorage.getItem("userId"));

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<Profile | null>(null);
  const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null);
  const [cameraMode, setCameraMode] = useState<"photo" | "video" | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/chat");
  };

  useEffect(() => {
    api
      .get(`/users/${userId}`)
      .then((d) => setPartner(mapApiUser(d)))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraStream]);

  const fetchMessages = async () => {
    try {
      const data = await api.get<any[]>(`/messages/${userId}`);

      const formatted: ChatMessage[] = data.map((msg) => ({
        id: msg.id,
        text: msg.content || "",
        mediaUrl: msg.mediaUrl || "",
        mediaType:
          msg.mediaType === "image" || msg.mediaType === "video"
            ? msg.mediaType
            : undefined,
        reaction: msg.reaction || "",
        sender: msg.senderId === currentUserId ? ("me" as const) : ("them" as const),
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || Number.isNaN(userId)) return;
    fetchMessages();
  }, [userId]);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const url = await fileToDataUrl(file);
    setMediaPreview({ url, type });
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
    setCameraMode(null);
    setIsRecording(false);
  };

  const openCamera = async (mode: "photo" | "video") => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: mode === "video",
      });
      setCameraMode(mode);
      setCameraStream(stream);
    } catch (err) {
      console.error("Camera permission failed", err);
      alert("Camera access was not allowed.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setMediaPreview({ url: canvas.toDataURL("image/jpeg", 0.9), type: "image" });
    stopCamera();
  };

  const startRecording = () => {
    if (!cameraStream) return;

    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(cameraStream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = await fileToDataUrl(new File([blob], "recording.webm", { type: "video/webm" }));
      setMediaPreview({ url, type: "video" });
      stopCamera();
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed && !mediaPreview) return;

    const tempMessage = {
      id: Date.now(),
      text: trimmed,
      mediaUrl: mediaPreview?.url,
      mediaType: mediaPreview?.type,
      sender: "me" as const,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    setMediaPreview(null);

    try {
      await api.post("/messages", {
        content: trimmed,
        mediaUrl: tempMessage.mediaUrl,
        mediaType: tempMessage.mediaType,
        receiverId: userId,
      });

      fetchMessages();
    } catch (err) {
      console.error("Send message failed", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  };

  const handleReaction = async (messageId: number, reaction: string) => {
    const current = messages.find((message) => message.id === messageId)?.reaction;
    const nextReaction = current === reaction ? null : reaction;

    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? { ...message, reaction: nextReaction || "" }
          : message
      )
    );

    try {
      await api.patch(`/messages/${messageId}/reaction`, {
        reaction: nextReaction,
      });
    } catch (err) {
      console.error("Reaction failed", err);
      fetchMessages();
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to unsend this message?");
    if (!confirmDelete) return;

    try {
      await api.del(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error("Delete message failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 lg:pb-0">
      <Header showBackButton onBackClick={handleBack} />

      <div className="bg-white shadow-sm px-4 md:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <AnimatedAvatar
            name={partner?.fullName}
            imageUrl={partner?.profilePicture}
            size="md"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate">
              {partner?.fullName || "User"}
            </h3>
            <p className="text-sm text-cyan-500 truncate">{partner?.username || ""}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[82%] md:max-w-[62%] group">
                  <div
                    className={`rounded-2xl px-4 py-3 relative ${
                      message.sender === "me"
                        ? "bg-cyan-500 text-white rounded-br-sm"
                        : "bg-white text-gray-900 shadow-md rounded-bl-sm"
                    }`}
                  >
                    {message.mediaUrl && message.mediaType === "image" && (
                      <img
                        src={message.mediaUrl}
                        alt="Shared"
                        className="rounded-xl mb-3 max-h-80 w-full object-cover"
                      />
                    )}

                    {message.mediaUrl && message.mediaType === "video" && (
                      <video
                        controls
                        src={message.mediaUrl}
                        className="rounded-xl mb-3 max-h-80 w-full bg-black"
                      />
                    )}

                    {message.text && (
                      <p className="text-sm md:text-base whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}

                    {message.reaction && (
                      <span className="absolute -bottom-3 right-3 bg-white text-lg shadow rounded-full px-2 py-0.5">
                        {message.reaction}
                      </span>
                    )}

                    {message.sender === "me" && (
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="absolute -top-2 -left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        aria-label="Unsend message"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1 mt-2 ${
                      message.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {reactions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleReaction(message.id, emoji)}
                        className={`w-7 h-7 rounded-full text-sm bg-white shadow-sm hover:scale-110 transition ${
                          message.reaction === emoji ? "ring-2 ring-cyan-400" : ""
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      message.sender === "me" ? "text-right" : "text-left"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="bg-white border-t border-gray-200 px-4 md:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          {mediaPreview && (
            <div className="mb-3 inline-flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
              {mediaPreview.type === "image" ? (
                <img src={mediaPreview.url} alt="Preview" className="w-28 h-20 object-cover rounded-lg" />
              ) : (
                <video src={mediaPreview.url} className="w-28 h-20 object-cover rounded-lg bg-black" />
              )}
              <button
                type="button"
                onClick={() => setMediaPreview(null)}
                className="p-1 rounded-full hover:bg-gray-200"
                aria-label="Remove media"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex gap-2 md:gap-3 items-center">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => handleFileSelect(event, "image")}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={(event) => handleFileSelect(event, "video")}
            />

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Share picture"
            >
              <Image size={20} />
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Share video"
            >
              <Video size={20} />
            </button>
            <button
              type="button"
              onClick={() => openCamera("photo")}
              className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Take picture"
            >
              <Camera size={20} />
            </button>
            <button
              type="button"
              onClick={() => openCamera("video")}
              className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Take video"
            >
              <VideoIcon size={20} />
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
            />

            <button
              onClick={handleSendMessage}
              className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {cameraMode && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">
                {cameraMode === "photo" ? "Take picture" : "Take video"}
              </h3>
              <button type="button" onClick={stopCamera} className="p-2 rounded-full hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <video ref={videoRef} autoPlay playsInline muted className="w-full bg-black aspect-video" />

            <div className="p-4 flex justify-end gap-3">
              {cameraMode === "photo" ? (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="bg-cyan-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-cyan-600"
                >
                  Capture
                </button>
              ) : isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-600"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-cyan-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-cyan-600"
                >
                  Record
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
