const TAG_COLORS = [
  "#6366F1", // indigo-500
  "#22D3EE", // cyan-400
  "#5384AD", // blue-200
  "#10B981", // emerald-500
  "#F43F5E", // rose-500
  "#FBBF24", // amber-400
  "#3B82F6", // blue-500
  "#A855F7", // purple-500
  "#F472B6", // pink-400
  "#F87171", // red-400
  "#6EE7B7", // green-300
  "#FDE68A", // yellow-200
  "#818CF8", // indigo-400
  "#FCA5A5", // red-300
  "#64748B", // slate-500
];

/**
 * Returns a color for a tag based on its id or name.
 * @param tagId string
 * @param tagName string
 * @returns string (hex color)
 */
export const getTagColor = (tagId: string, tagName?: string): string => {
  // Prefer id, fallback to name
  const key = tagId || tagName || '';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}; 