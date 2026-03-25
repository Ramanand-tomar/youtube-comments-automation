function parseVideoId(input) {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();

  // Raw video ID (11 characters, alphanumeric + _ + -)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.replace("www.", "");

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      // /watch?v=VIDEO_ID
      if (url.pathname === "/watch") {
        return url.searchParams.get("v") || null;
      }
      // /embed/VIDEO_ID or /shorts/VIDEO_ID or /v/VIDEO_ID
      const match = url.pathname.match(/^\/(embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[2];
    }

    // youtu.be/VIDEO_ID
    if (hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // Not a valid URL
  }

  return null;
}

module.exports = parseVideoId;
