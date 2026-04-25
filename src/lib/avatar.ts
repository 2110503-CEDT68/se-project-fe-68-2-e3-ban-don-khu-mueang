export function getDicebearAvatarUrl(seed: string) {
  const safeSeed = seed.trim() || "user";
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(safeSeed)}`;
}

export function getUserAvatarUrl(
  avatarUrl?: string | null,
  seed?: string | null,
) {
  const normalizedAvatarUrl = avatarUrl?.trim();

  if (normalizedAvatarUrl) {
    return normalizedAvatarUrl;
  }

  return getDicebearAvatarUrl(seed ?? "user");
}