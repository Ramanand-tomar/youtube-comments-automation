import { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Search, Loader2, Lightbulb, ThumbsUp, ThumbsDown,
  Trophy, HelpCircle, MessageSquare, ChevronDown, ChevronUp,
  ArrowLeft, BarChart3, Eye, Heart, Play, ExternalLink,
} from "lucide-react";
import { api } from "../api/client";
import { Navbar } from "../sections/Navbar";

const CATEGORIES = [
  { key: "suggestion",    label: "Next Video Suggestions", icon: Lightbulb,   color: "#3b82f6", bg: "bg-blue-100",   text: "text-blue-600",   border: "border-blue-200"   },
  { key: "appreciation",  label: "Appreciation",           icon: ThumbsUp,    color: "#22c55e", bg: "bg-green-100",  text: "text-green-600",  border: "border-green-200"  },
  { key: "negative",      label: "Negative Feedback",      icon: ThumbsDown,  color: "#ef4444", bg: "bg-red-100",    text: "text-red-600",    border: "border-red-200"    },
  { key: "success_story", label: "Success Stories",         icon: Trophy,      color: "#a855f7", bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
  { key: "query",         label: "Customer Queries",        icon: HelpCircle,  color: "#f59e0b", bg: "bg-amber-100",  text: "text-amber-600",  border: "border-amber-200"  },
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
        className="w-full px-6 py-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors cursor-pointer"
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
        <div className="border-t border-neutral-100 divide-y divide-neutral-100">
          {shown.map((c, i) => (
            <div key={i} className="px-6 py-3 flex items-start gap-3">
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
          {!open && comments.length > 3 && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full px-6 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Show all {comments.length} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function VideoAnalytics() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await api.analyzeVideo(videoUrl.trim());
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to analyze video. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const pieData = results
    ? CATEGORIES.map((cat) => ({
        name: cat.label,
        value: results.summary[cat.key] || 0,
        color: cat.color,
        pct: results.summary.total > 0
          ? Math.round(((results.summary[cat.key] || 0) / results.summary.total) * 100)
          : 0,
      })).filter((d) => d.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-neutral-50 font-inter">
      <Navbar />

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
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !videoUrl.trim()}
              className="px-6 py-3 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Comments"
              )}
            </button>
          </div>
        </form>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-6 mb-8 animate-pulse">
            {/* Video info skeleton */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="shrink-0 sm:w-72 h-40 bg-neutral-200" />
                <div className="p-5 flex-1 space-y-3">
                  <div className="h-5 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-100 rounded w-1/3" />
                  <div className="flex gap-4 mt-2">
                    <div className="h-3 bg-neutral-100 rounded w-20" />
                    <div className="h-3 bg-neutral-100 rounded w-16" />
                    <div className="h-3 bg-neutral-100 rounded w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stat cards skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-neutral-200 rounded-xl" />
                  <div className="h-2.5 bg-neutral-200 rounded w-16" />
                  <div className="h-7 bg-neutral-200 rounded w-10" />
                </div>
              ))}
            </div>

            {/* Chart skeleton */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-neutral-200 rounded-lg" />
                <div className="h-4 bg-neutral-200 rounded w-40" />
              </div>
              <div className="flex items-center justify-center h-[300px]">
                <div className="w-44 h-44 rounded-full border-[20px] border-neutral-200" />
              </div>
            </div>

            {/* Category accordions skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 shadow-sm px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-200 rounded-lg" />
                <div className="h-4 bg-neutral-200 rounded flex-1 max-w-[160px]" />
                <div className="h-6 bg-neutral-100 rounded-full w-10 ml-auto" />
              </div>
            ))}

            {/* Loading message overlay */}
            <div className="text-center">
              <Loader2 className="w-6 h-6 text-orange-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-neutral-700 mt-3">Fetching and analyzing comments...</p>
              <p className="text-xs text-neutral-500 mt-1">This may take a moment for videos with many comments</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 mb-8">
            {error}
          </div>
        )}

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
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
