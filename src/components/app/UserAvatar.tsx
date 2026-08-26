import type { CurrentUser } from "../../data/mockUser";

function getInitials(name: string, fallback: string) {
  const source = name.trim() || fallback.trim();

  if (!source) {
    return "TW";
  }

  return source
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function UserAvatar({
  user,
  size = "md"
}: {
  user: Pick<CurrentUser, "name" | "email" | "avatar">;
  size?: "sm" | "md";
}) {
  const dimensionClass = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt=""
        className={`${dimensionClass} shrink-0 rounded-full border border-purple-200/35 object-cover`}
      />
    );
  }

  return (
    <span
      className={`${dimensionClass} grid shrink-0 place-items-center rounded-full border border-purple-200/25 bg-gradient-to-br from-[#8b5cf6] to-[#4c2a8e] font-semibold text-white shadow-[0_0_22px_rgba(139,92,246,0.24)]`}
      aria-hidden="true"
    >
      {getInitials(user.name, user.email)}
    </span>
  );
}
