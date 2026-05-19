import clsx from "clsx";

const gradients = [
  "from-cyan-400 via-sky-500 to-violet-500",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-rose-400 via-fuchsia-500 to-violet-500",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-lime-400 via-emerald-500 to-slate-700",
];

const sizes = {
  sm: "w-10 h-10 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

interface AnimatedAvatarProps {
  name?: string;
  imageUrl?: string;
  size?: keyof typeof sizes;
  className?: string;
}

function initialsFromName(name?: string) {
  const parts = (name || "Dvince User")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function gradientForName(name?: string) {
  const value = name || "Dvince User";
  const index =
    value.split("").reduce((total, char) => total + char.charCodeAt(0), 0) %
    gradients.length;

  return gradients[index];
}

export default function AnimatedAvatar({
  name,
  imageUrl,
  size = "md",
  className = "",
}: AnimatedAvatarProps) {
  return (
    <div
      className={clsx(
        "animated-avatar relative rounded-full p-[2px] shadow-sm",
        sizes[size],
        className
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-90",
          gradientForName(name)
        )}
      />
      <div className="relative w-full h-full rounded-full bg-white/20 overflow-hidden flex items-center justify-center ring-2 ring-white">
        {imageUrl ? (
          <img src={imageUrl} alt={name || "Avatar"} className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-white drop-shadow-sm">
            {initialsFromName(name)}
          </span>
        )}
      </div>
      <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
    </div>
  );
}
