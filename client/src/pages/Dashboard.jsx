import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { ArrowLeft, LayoutDashboard, Video, Settings, Loader2, MessageSquare, RefreshCw, BarChart2 } from "lucide-react";
import ConnectChannel from "../components/dashboard/ConnectChannel";
import StatsCards from "../components/dashboard/StatsCards";
import VideoList from "../components/dashboard/VideoList";
import CommentTable from "../components/dashboard/CommentTable";
import SettingsPanel from "../components/dashboard/SettingsPanel";
import AnalyticsPanel from "../components/dashboard/AnalyticsPanel";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("overview");
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [autoReplyMode, setAutoReplyMode] = useState("all");
  const [autoReplyVideoIds, setAutoReplyVideoIds] = useState([]);

  useEffect(() => {
    if (user) {
      setLoadingVideos(true);
      api.getVideos()
        .then(setVideos)
        .catch(console.error)
        .finally(() => setLoadingVideos(false));
      // Fetch current auto-reply settings
      api.getSettings()
        .then((s) => {
          setAutoReplyMode(s.autoReplyMode || "all");
          setAutoReplyVideoIds(s.autoReplyVideoIds || []);
        })
        .catch(console.error);
    }
  }, [user, refreshKey]);

  const [syncing, setSyncing] = useState(false);

  const handleToggleVideoAutoReply = async (videoId) => {
    const updated = autoReplyVideoIds.includes(videoId)
      ? autoReplyVideoIds.filter((id) => id !== videoId)
      : [...autoReplyVideoIds, videoId];
    setAutoReplyVideoIds(updated);
    try {
      await api.updateSettings({ autoReplyVideoIds: updated });
    } catch (err) {
      console.error("Failed to update video auto-reply:", err);
      setAutoReplyVideoIds(autoReplyVideoIds); // revert on error
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.triggerJob();
      setTimeout(() => {
        setRefreshKey((k) => k + 1);
        setSyncing(false);
      }, 3000);
    } catch (err) {
      console.error("Sync error:", err);
      setSyncing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        {/* Skeleton header */}
        <div className="bg-white border-b border-warm-border h-[72px] px-6 lg:px-10 flex items-center gap-6">
          <div className="w-8 h-8 bg-gray-200 rounded-sm animate-pulse" />
          <div className="w-28 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <div className="hidden sm:flex gap-2">
            {[80, 60, 70, 60].map((w, i) => (
              <div key={i} className="h-9 rounded-lg bg-gray-200 animate-pulse" style={{ width: `${w}px` }} />
            ))}
          </div>
        </div>
        {/* Skeleton body */}
        <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          <div className="h-14 bg-white rounded-2xl border border-warm-border animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-warm-border animate-pulse" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="h-64 bg-white rounded-2xl border border-warm-border animate-pulse" />
            <div className="lg:col-span-2 h-64 bg-white rounded-2xl border border-warm-border animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview",   label: "Overview",   icon: LayoutDashboard },
    { key: "videos",     label: "Videos",     icon: Video           },
    { key: "analytics",  label: "Analytics",  icon: BarChart2       },
    { key: "settings",   label: "Settings",   icon: Settings        },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top bar */}
      <header className="bg-white border-b border-warm-border sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-warm-border bg-warm-gray hover:bg-brand-bg hover:border-brand/30 text-text-secondary hover:text-brand transition-all"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link to="/" className="flex items-center gap-2 group transition-all">
              <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform">
                <MessageSquare className="w-5 h-5 text-white -rotate-45 group-hover:rotate-0 transition-transform" />
              </div>
              <span className="text-[1.25rem] font-black text-text-primary tracking-tight">BeyondChats</span>
            </Link>
            <div className="h-6 w-px bg-warm-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1 bg-warm-gray rounded-xl p-1 border border-warm-border">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-6 py-2 text-[0.875rem] font-bold rounded-lg transition-all cursor-pointer ${
                    tab === t.key ? "bg-white text-brand shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-warm-gray px-4 py-2 rounded-xl border border-warm-border">
              <div className="w-8 h-8 bg-brand-bg rounded-full flex items-center justify-center text-[0.75rem] font-bold text-brand">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-[0.875rem] font-bold text-text-primary hidden md:inline">{user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      {user && (
        <div className="sm:hidden bg-white border-b border-warm-border px-4 py-3 flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 text-[0.875rem] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                tab === t.key ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-warm-gray text-text-secondary"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      )}

      <main className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <ConnectChannel />

        {user && (
          <>
            {tab === "overview" && (
              <div className="space-y-5">
                {/* Sync bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-2xl border border-warm-border px-5 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <p className="text-[0.8125rem] text-text-secondary">
                    {videos.length > 0
                      ? `${videos.length} video(s) with comments`
                      : "No comments synced yet. Click Sync to fetch your YouTube comments."}
                  </p>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-full text-[0.8125rem] font-semibold disabled:opacity-50 transition-all cursor-pointer hover:shadow-[0_4px_12px_rgba(80,62,189,0.3)]"
                  >
                    {syncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {syncing ? "Syncing..." : "Sync Comments"}
                  </button>
                </div>

                {loadingVideos ? (
                  <div className="space-y-5">
                    {/* Stats skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-warm-border p-5 animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                            <div className="space-y-2 flex-1">
                              <div className="h-3 w-20 bg-gray-200 rounded" />
                              <div className="h-6 w-12 bg-gray-200 rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Video list + Comment table skeleton */}
                    <div className="grid lg:grid-cols-3 gap-5">
                      <div className="bg-white rounded-2xl border border-warm-border p-5 animate-pulse space-y-3">
                        <div className="h-5 w-24 bg-gray-200 rounded" />
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-14 bg-gray-100 rounded-xl" />
                        ))}
                      </div>
                      <div className="lg:col-span-2 bg-white rounded-2xl border border-warm-border p-5 animate-pulse space-y-4">
                        <div className="flex justify-between">
                          <div className="h-5 w-24 bg-gray-200 rounded" />
                          <div className="h-8 w-40 bg-gray-200 rounded-xl" />
                        </div>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="h-4 w-28 bg-gray-200 rounded" />
                              <div className="h-5 w-16 bg-gray-100 rounded-lg" />
                            </div>
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-4 w-3/4 bg-gray-100 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <StatsCards videos={videos} />
                    <div className="grid lg:grid-cols-3 gap-5">
                      <div className="lg:col-span-1">
                        <VideoList
                          videos={videos}
                          selectedVideoId={selectedVideoId}
                          onSelectVideo={setSelectedVideoId}
                          autoReplyMode={autoReplyMode}
                          autoReplyVideoIds={autoReplyVideoIds}
                          onToggleVideoAutoReply={handleToggleVideoAutoReply}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <CommentTable selectedVideoId={selectedVideoId} refreshKey={refreshKey} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "videos" && (
              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1">
                  <VideoList
                    videos={videos}
                    selectedVideoId={selectedVideoId}
                    onSelectVideo={setSelectedVideoId}
                  />
                </div>
                <div className="lg:col-span-2">
                  <CommentTable selectedVideoId={selectedVideoId} refreshKey={refreshKey} />
                </div>
              </div>
            )}

            {tab === "analytics" && (
              <AnalyticsPanel refreshKey={refreshKey} />
            )}

            {tab === "settings" && (
              <SettingsPanel
                onTrigger={handleSync}
                videos={videos}
                onSettingsSaved={(s) => {
                  setAutoReplyMode(s.autoReplyMode || "all");
                  setAutoReplyVideoIds(s.autoReplyVideoIds || []);
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
