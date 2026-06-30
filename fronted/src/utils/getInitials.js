export const getInitials = (name = "") => {
  if (!name.trim()) return "";

  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};