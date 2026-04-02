import { useState, useEffect, useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Search, Loader2, Lightbulb, ThumbsUp, ThumbsDown,
  Trophy, HelpCircle, MessageSquare, ChevronDown, ChevronUp,
  ArrowLeft, BarChart3, Eye, Heart, Play, ExternalLink,
  CheckCircle2, CircleDot, X, MessageCircle,
  Mail, Bell, Send, CheckCircle, Clock, History, LogIn, LogOut, User,
} from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const CATEGORIES = [
  { key: "suggestion",    label: "Next Video Suggestions", icon: Lightbulb,   color: "#3b82f6", bg: "bg-blue-100",   text: "text-blue-600",   border: "border-blue-200"   },
  { key: "appreciation",  label: "Appreciation",           icon: ThumbsUp,    color: "#22c55e", bg: "bg-green-100",  text: "text-green-600",  border: "border-green-200"  },
  { key: "negative",      label: "Negative Feedback",      icon: ThumbsDown,  color: "#ef4444", bg: "bg-red-100",    text: "text-red-600",    border: "border-red-200"    },
  { key: "success_story", label: "Success Stories",         icon: Trophy,      color: "#a855f7", bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
  { key: "query",         label: "Customer Queries",        icon: HelpCircle,  color: "#f59e0b", bg: "bg-amber-100",  text: "text-amber-600",  border: "border-amber-200"  },
  { key: "irrelevant",    label: "Generic Comments",      icon: MessageCircle, color: "#a3a3a3", bg: "bg-neutral-100", text: "text-neutral-500", border: "border-neutral-200" },
];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-bold" style={{ color: d.payload.color }}>{d.name}</p>
      <p className="text-neutral-600">{d.value} comments ({d.payload.pct}%)</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgClass, textClass, borderClass }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col items-center text-center gap-2 min-w-0">
      <div className={`w-10 h-10 rounded-xl ${bgClass} ${borderClass} border flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${textClass}`} />
      </div>
      <p className="text-[0.65rem] text-neutral-500 font-semibold uppercase tracking-wide leading-tight">{label}</p>
      <p className="text-2xl font-black text-neutral-900 leading-none">{value}</p>
    </div>
  );
}

const PROGRESS_STEPS = [
  { key: "fetching_info", label: "Fetching video information" },
  { key: "fetching_comments", label: "Retrieving comments from YouTube" },
  { key: "classifying", label: "Classifying comments with AI" },
  { key: "saving", label: "Generating analytics report" },
];

function AnalysisProgress({ jobStatus }) {
  if (!jobStatus || jobStatus.status === "completed") return null;

  const progress = jobStatus.progress || 0;
  const currentStatus = jobStatus.status;
  const stepOrder = PROGRESS_STEPS.map((s) => s.key);
  const currentIdx = stepOrder.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-700">
            {jobStatus.currentStep || "Analyzing video..."}
          </span>
          <span className="text-sm font-bold text-orange-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {PROGRESS_STEPS.map((step, i) => {
          const isDone = i < currentIdx;
          const isActive = i === currentIdx;
          return (
            <div key={step.key} className="flex items-center gap-3">
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin shrink-0" />
              ) : (
                <CircleDot className="w-5 h-5 text-neutral-300 shrink-0" />
              )}
              <span className={`text-sm ${isDone ? "text-green-600 font-medium" : isActive ? "text-orange-700 font-semibold" : "text-neutral-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Time estimate */}
      <p className="text-xs text-neutral-400 mt-4 text-center">
        This usually takes 1-5 minutes depending on the number of comments.
      </p>
    </div>
  );
}

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

function CategoryBadges({ categories, currentCategory }) {
  // Show badges for other categories this comment also belongs to
  const others = (categories || []).filter((k) => k !== currentCategory);
  if (others.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {others.map((k) => {
        const cat = CATEGORY_MAP[k];
        if (!cat) return null;
        return (
          <span key={k} className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded ${cat.bg} ${cat.text}`}>
            {cat.label}
          </span>
        );
      })}
    </div>
  );
}

function CommentAccordion({ category, comments }) {
  const [open, setOpen] = useState(false);
  const Icon = category.icon;
  const shown = open ? comments : comments.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 sm:px-6 py-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <div className={`w-8 h-8 rounded-lg ${category.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${category.text}`} />
        </div>
        <span className="text-sm font-bold text-neutral-900 flex-1 text-left">{category.label}</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${category.bg} ${category.text}`}>
          {comments.length}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>
      {comments.length === 0 && open && (
        <div className="border-t border-neutral-100 px-6 py-6 text-center">
          <p className="text-sm text-neutral-400">No comments in this category</p>
        </div>
      )}
      {shown.length > 0 && (
        <div className="border-t border-neutral-100">
          <div className={`divide-y divide-neutral-100 ${open ? "max-h-[400px] overflow-y-auto" : ""}`}>
            {shown.map((c, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[0.6rem] font-bold text-neutral-500">
                    {c.author?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-neutral-500">{c.author}</p>
                  <p className="text-sm text-neutral-800 mt-0.5 break-words" dangerouslySetInnerHTML={{ __html: c.text }} />
                  <CategoryBadges categories={c.categories} currentCategory={category.key} />
                </div>
                {c.likeCount > 0 && (
                  <span className="text-xs text-neutral-400 shrink-0 mt-1">{c.likeCount} likes</span>
                )}
              </div>
            ))}
          </div>
          {!open && comments.length > 3 && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full px-4 sm:px-6 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 border-t border-neutral-100 transition-colors cursor-pointer"
            >
              Show all {comments.length} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NotifyModal({ open, onClose, onSubmit, submitting, submitted }) {
  const [inputEmail, setInputEmail] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">You're all set!</h3>
            <p className="text-sm text-neutral-500 mb-5">
              We'll email you when your analysis is ready. You can close this tab safely.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Analysis in progress!</h3>
            <p className="text-sm text-neutral-500 mb-1">
              This can take <strong>1-10 minutes</strong> depending on the number of comments.
            </p>
            <p className="text-sm text-neutral-500 mb-5">
              Want us to notify you when it's done?
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputEmail.trim()) onSubmit(inputEmail.trim());
              }}
              className="w-full"
            >
              <div className="relative mb-3">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                  disabled={submitting}
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !inputEmail.trim()}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Notify Me
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={onClose}
              className="mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              No thanks, I'll wait here
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoAnalytics() {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const pollingRef = useRef(null);

  const [searchParams] = useSearchParams();
  const { user, login, logout, isAuthenticated } = useAuth();
  const polling = !!jobId;

  // Fetch history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await api.getAnalysisHistory();
      setHistory(data.history || []);
      setDailyLimit(data.dailyLimit || null);
    } catch {
      // Silently fail — history is non-critical
    } finally {
      setHistoryLoading(false);
    }
  }

  // Auto-load results from email link (?videoId=...)
  useEffect(() => {
    const vid = searchParams.get("videoId");
    if (vid && !results && !jobId) {
      setVideoUrl(`https://www.youtube.com/watch?v=${vid}`);
      api.startAnalysis(`https://www.youtube.com/watch?v=${vid}`).then((data) => {
        if (data.cached) {
          setResults(data);
          loadHistory();
        } else if (data.jobId) {
          setJobId(data.jobId);
          setJobStatus({ status: data.status, progress: data.progress, currentStep: data.currentStep });
        }
      }).catch((err) => setError(err.message));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling effect
  useEffect(() => {
    if (!jobId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const status = await api.getAnalysisStatus(jobId);
        setJobStatus(status);

        if (status.status === "completed") {
          clearInterval(pollingRef.current);
          setJobId(null);
          setJobStatus(null);
          setResults(status);
          loadHistory();
        } else if (status.status === "failed") {
          clearInterval(pollingRef.current);
          setJobId(null);
          setJobStatus(null);
          setError(status.error || "Analysis failed. Please try again.");
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    }, 3000);

    return () => clearInterval(pollingRef.current);
  }, [jobId]);

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setError(null);
    setResults(null);
    setJobStatus(null);
    setNotifySubmitted(false);
    setSubmitting(true);

    try {
      const data = await api.startAnalysis(videoUrl.trim());

      if (data.cached) {
        setResults(data);
        loadHistory();
      } else if (data.jobId) {
        setJobId(data.jobId);
        setJobStatus({ status: data.status, progress: data.progress, currentStep: data.currentStep });
        setShowNotifyModal(true);
        loadHistory();
      } else if (data.dailyLimit && !data.dailyLimit.canAnalyze) {
        setError(data.error || "Daily analysis limit reached.");
        setDailyLimit(data.dailyLimit);
      }
    } catch (err) {
      if (err.data?.dailyLimit) {
        setDailyLimit(err.data.dailyLimit);
      }
      setError(err.message || "Failed to start analysis. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNotifySubmit(emailValue) {
    if (!jobId) return;
    setNotifySubmitting(true);
    try {
      await api.subscribeNotify(jobId, emailValue);
      setNotifySubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to subscribe for notifications.");
      setShowNotifyModal(false);
    } finally {
      setNotifySubmitting(false);
    }
  }

  async function handleRemoveFromHistory(videoId) {
    try {
      await api.removeFromHistory(videoId);
      setHistory((prev) => prev.filter((h) => h.videoId !== videoId));
    } catch {
      // Silently fail
    }
  }

  function handleHistoryClick(vid) {
    setVideoUrl(`https://www.youtube.com/watch?v=${vid}`);
    setError(null);
    setResults(null);
    setJobStatus(null);
    api.startAnalysis(`https://www.youtube.com/watch?v=${vid}`).then((data) => {
      if (data.cached) {
        setResults(data);
      } else if (data.jobId) {
        setJobId(data.jobId);
        setJobStatus({ status: data.status, progress: data.progress, currentStep: data.currentStep });
      }
    }).catch((err) => setError(err.message));
  }

  const total = results ? results.summary.total : 0;
  const pieData = results
    ? CATEGORIES.map((cat) => ({
        name: cat.label,
        value: results.summary[cat.key] || 0,
        color: cat.color,
        pct: total > 0
          ? Math.round(((results.summary[cat.key] || 0) / total) * 100)
          : 0,
      })).filter((d) => d.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-neutral-50 font-inter">

      <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-8">
        {/* Back link */}
        <a href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-orange-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6 overflow-hidden border border-orange-200 mb-8">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-200/40 rounded-full" />
          <div className="absolute -bottom-6 -right-4 w-20 h-20 bg-orange-200/40 rounded-full" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900">YouTube Video Comment Analytics</h1>
              <p className="text-sm text-orange-700 mt-0.5">
                Paste any YouTube video link to get AI-powered comment analysis
              </p>
            </div>
          </div>
        </div>

        {/* Auth bar */}
        {isAuthenticated ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">{user?.name || user?.email?.split("@")[0]}</p>
                <p className="text-xs text-green-600">Your history is synced across devices</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-green-700 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-blue-700">
              <LogIn className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Sign in with Google to save your analysis history across devices.
            </p>
            <button
              type="button"
              onClick={login}
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Sign in
            </button>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleAnalyze} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-8">
          <label htmlFor="video-url" className="text-sm font-bold text-neutral-700 mb-2 block">
            YouTube Video URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="video-url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-10 pr-4 py-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                disabled={submitting || polling}
              />
            </div>
            <button
              type="submit"
              disabled={submitting || polling || !videoUrl.trim() || (dailyLimit && !dailyLimit.canAnalyze)}
              className="px-6 py-3 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {submitting || polling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {submitting ? "Starting..." : "Analyzing..."}
                </>
              ) : (
                "Analyze Comments"
              )}
            </button>
          </div>

          {/* Daily limit indicator */}
          {dailyLimit && (
            <div className={`mt-3 flex items-center gap-2 text-xs ${dailyLimit.canAnalyze ? "text-green-600" : "text-amber-600"}`}>
              <Clock className="w-3.5 h-3.5" />
              {dailyLimit.canAnalyze ? (
                <span>You have <strong>1 free analysis</strong> remaining today. Previously analyzed videos are always free.</span>
              ) : (
                <span>
                  Daily limit reached. {dailyLimit.resetsAt && (
                    <>Resets at {new Date(dailyLimit.resetsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} UTC.</>
                  )} Previously analyzed videos are always free.
                </span>
              )}
            </div>
          )}
        </form>

        {/* Progress tracker */}
        <AnalysisProgress jobStatus={jobStatus} />

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 mb-8">
            {error}
          </div>
        )}

        {/* Notify me modal - shown when processing starts */}
        <NotifyModal
          open={showNotifyModal}
          onClose={() => setShowNotifyModal(false)}
          onSubmit={handleNotifySubmit}
          submitting={notifySubmitting}
          submitted={notifySubmitted}
        />

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Video info panel */}
            {results.videoInfo?.title && (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <a
                    href={`https://www.youtube.com/watch?v=${results.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative shrink-0 sm:w-72 group"
                  >
                    <img
                      src={results.videoInfo.thumbnail}
                      alt={results.videoInfo.title}
                      className="w-full sm:w-72 h-auto object-cover sm:h-full"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white fill-white" />
                    </div>
                  </a>
                  {/* Details */}
                  <div className="p-5 flex flex-col justify-center min-w-0 flex-1">
                    <a
                      href={`https://www.youtube.com/watch?v=${results.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-neutral-900 hover:text-orange-600 transition-colors line-clamp-2 flex items-start gap-2"
                    >
                      {results.videoInfo.title}
                      <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" />
                    </a>
                    <p className="text-sm text-neutral-500 mt-1">{results.videoInfo.channelTitle}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-neutral-500">
                      {results.videoInfo.viewCount != null && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {results.videoInfo.viewCount.toLocaleString()} views
                        </span>
                      )}
                      {results.videoInfo.likeCount != null && (
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {results.videoInfo.likeCount.toLocaleString()} likes
                        </span>
                      )}
                      {results.videoInfo.commentCount != null && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {results.videoInfo.commentCount.toLocaleString()} comments
                          {results.summary?.total != null && results.videoInfo.commentCount > results.summary.total && (
                            <span className="text-neutral-400">
                              ({results.summary.total.toLocaleString()} top-level · {(results.videoInfo.commentCount - results.summary.total).toLocaleString()} replies)
                            </span>
                          )}
                        </span>
                      )}
                      {results.videoInfo.publishedAt && (
                        <span>
                          {new Date(results.videoInfo.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              <StatCard
                icon={MessageSquare}
                label="Total Comments"
                value={results.summary.total}
                bgClass="bg-orange-100"
                textClass="text-orange-600"
                borderClass="border-orange-200"
              />
              {CATEGORIES.map((cat) => (
                <StatCard
                  key={cat.key}
                  icon={cat.icon}
                  label={cat.label}
                  value={results.summary[cat.key] || 0}
                  bgClass={cat.bg}
                  textClass={cat.text}
                  borderClass={cat.border}
                />
              ))}
            </div>

            {/* Pie chart */}
            {pieData.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Comment Distribution</span>
                </div>
                <div className="px-4 py-6 flex flex-col md:flex-row items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Category accordions */}
            <div className="space-y-4">
              {CATEGORIES.map((cat) => (
                <CommentAccordion
                  key={cat.key}
                  category={cat}
                  comments={results.categories[cat.key] || []}
                />
              ))}
            </div>

            {/* Fetched count note */}
            {results.totalFetched && (
              <p className="text-center text-xs text-neutral-400">
                Analyzed {results.totalFetched} comments from this video
                {results.summary.irrelevant > 0 && (
                  <span> &middot; {results.summary.irrelevant} generic/irrelevant comments filtered out</span>
                )}
              </p>
            )}
          </div>
        )}
        {/* Past Analytics History */}
        {!historyLoading && history.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-neutral-500" />
              <h2 className="text-base font-bold text-neutral-900">Your Past Analyses</h2>
              <span className="text-xs text-neutral-400 ml-1">({history.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => (
                <div
                  key={item.videoId}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:border-orange-300 transition-colors group"
                >
                  {/* Clickable area */}
                  <button
                    type="button"
                    onClick={() => handleHistoryClick(item.videoId)}
                    className="w-full text-left cursor-pointer"
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title || item.videoId}
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 bg-neutral-100 flex items-center justify-center">
                        <Play className="w-10 h-10 text-neutral-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm font-bold text-neutral-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {item.title || item.videoId}
                      </p>
                      {item.channelTitle && (
                        <p className="text-xs text-neutral-500 mt-1">{item.channelTitle}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-neutral-400">
                          {item.totalComments > 0 ? `${item.totalComments} comments` : ""}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {new Date(item.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      {!item.isComplete && (
                        <p className="text-xs text-amber-600 mt-2 font-medium">Analysis unavailable — re-analyze to refresh</p>
                      )}
                    </div>
                  </button>
                  {/* Remove from history */}
                  <div className="px-4 pb-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveFromHistory(item.videoId)}
                      className="text-[0.65rem] text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Remove from history
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
