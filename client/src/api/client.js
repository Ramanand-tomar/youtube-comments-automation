const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  // Auth
  getAuthUrl: () => request("/auth/google"),
  getMe: () => request("/auth/me"),

  // Dashboard
  getVideos: () => request("/dashboard/videos"),
  getComments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/dashboard/comments${query ? `?${query}` : ""}`);
  },
  postReply: (commentId, text) =>
    request("/dashboard/comments/reply", {
      method: "POST",
      body: JSON.stringify({ commentId, text }),
    }),
  triggerJob: () =>
    request("/dashboard/comments/trigger", { method: "POST" }),

  // Analytics
  getAnalytics: (days = 7) => request(`/dashboard/analytics?days=${days}`),

  // Settings
  getSettings: () => request("/dashboard/settings"),
  updateSettings: (data) =>
    request("/dashboard/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Public Analytics
  startAnalysis: (videoUrl, email) =>
    request("/public/analyze", {
      method: "POST",
      body: JSON.stringify({ videoUrl, email: email || undefined }),
    }),
  getAnalysisStatus: (jobId) =>
    request(`/public/analyze/status/${jobId}`),
  subscribeNotify: (jobId, email) =>
    request(`/public/analyze/notify/${jobId}`, {
      method: "PATCH",
      body: JSON.stringify({ email }),
    }),
  deleteAnalysis: (videoId) =>
    request(`/public/analyze/${videoId}`, { method: "DELETE" }),
  removeFromHistory: (videoId) =>
    request(`/public/analyze/history/${videoId}`, { method: "DELETE" }),
  getAnalysisHistory: () =>
    request("/public/analyze/history"),
  migrateHistory: () =>
    request("/public/analyze/migrate-history", { method: "POST" }),
};
