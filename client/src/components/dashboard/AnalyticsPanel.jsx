import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Clock, MessageSquare, Users, Zap, Award } from "lucide-react";
import { api } from "../../api/client";

const BRAND = "#ff4f00";

// Format "2025-03-19" → "Mar 19"
function fmtDay(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Generate initials from name
function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Custom tooltip ─────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-warm-border rounded-xl px-4 py-3 shadow-lg text-[0.8125rem]">
      <p className="font-bold text-text-primary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "brand" }) {
  const colors = {
    brand:  { bg: "bg-brand/10",   text: "text-brand",    ring: "border-brand/20"    },
    green:  { bg: "bg-green-100",  text: "text-green-600", ring: "border-green-200"  },
    blue:   { bg: "bg-blue-100",   text: "text-blue-600",  ring: "border-blue-200"   },
    purple: { bg: "bg-purple-100", text: "text-purple-600", ring: "border-purple-200" },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-2xl border border-warm-border p-5 shadow-sm flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.ring} border flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div>
        <p className="text-[0.75rem] text-text-muted font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-[1.5rem] font-black text-text-primary leading-none mt-1">{value}</p>
        {sub && <p className="text-[0.75rem] text-text-muted mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AnalyticsPanel({ refreshKey }) {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getAnalytics(days)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [days, refreshKey]);

  // Format chart data labels
  const repliesChart = (data?.repliesOverTime || []).map((d) => ({
    ...d,
    day: fmtDay(d.day),
  }));
  const volumeChart = (data?.commentVolume || []).map((d) => ({
    ...d,
    day: fmtDay(d.day),
  }));
  const topCommenters = data?.topCommenters || [];
  const stats = data?.stats || { totalComments: 0, totalReplied: 0, replyRate: 0, avgResponseMin: 0 };

  const rangeOptions = [
    { label: "7 days",  value: 7  },
    { label: "14 days", value: 14 },
    { label: "30 days", value: 30 },
  ];

  return (
    <div className="w-full space-y-5">

      {/* ── Hero header ── */}
      <div className="relative bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6 overflow-hidden border border-orange-200">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-200/40 rounded-full" />
        <div className="absolute -bottom-6 -right-4 w-20 h-20 bg-orange-200/40 rounded-full" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-[1.125rem] font-bold text-text-primary">Analytics Dashboard</h2>
              <p className="text-[0.8125rem] text-orange-700 mt-0.5">
                Performance overview for the last {days} days
              </p>
            </div>
          </div>
          <div className="sm:ml-auto flex gap-1.5">
            {rangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                className={`text-[0.75rem] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                  days === opt.value
                    ? "bg-brand text-white shadow-sm"
                    : "bg-white/70 text-orange-600 border border-orange-200 hover:bg-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="space-y-5 animate-pulse">
          {/* Stat cards skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-warm-border p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gray-200 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-7 w-14 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Charts skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-warm-border overflow-hidden">
                <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40 flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-gray-200 rounded-lg" />
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </div>
                <div className="px-6 py-5 flex items-end gap-3 h-[220px]">
                  {[40, 65, 30, 80, 55, 70, 45].map((h, j) => (
                    <div key={j} className="flex-1 bg-gray-100 rounded-t-md" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Top commenters skeleton */}
          <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-200 rounded-lg" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
            <div className="divide-y divide-warm-border/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-6 h-4 bg-gray-200 rounded" />
                  <div className="w-9 h-9 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-4 w-8 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 text-[0.8125rem] text-red-700">
          Failed to load analytics: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Zap}          label="Replies Sent"   value={stats.totalReplied}              sub={`Last ${days} days`}        color="brand"  />
            <StatCard icon={MessageSquare} label="Total Comments" value={stats.totalComments}              sub="Across all videos"          color="blue"   />
            <StatCard icon={TrendingUp}   label="Reply Rate"     value={`${stats.replyRate}%`}            sub="Comments replied to"        color="green"  />
            <StatCard icon={Clock}        label="Avg. Response"  value={`${stats.avgResponseMin}m`}       sub="Time to first reply"        color="purple" />
          </div>

          {/* ── Charts grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Replies over time — Line chart */}
            <div className="bg-white rounded-2xl border border-warm-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-brand" />
                </div>
                <span className="text-[0.8125rem] font-bold text-text-primary uppercase tracking-wider">Replies Sent Over Time</span>
              </div>
              <div className="px-4 py-5">
                {repliesChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={repliesChart} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6d6d80" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#6d6d80" }} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="replies"
                        name="Replies"
                        stroke={BRAND}
                        strokeWidth={2.5}
                        dot={{ fill: BRAND, r: 4 }}
                        activeDot={{ r: 6, fill: BRAND }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-text-muted text-[0.8125rem] py-12">No reply data for this period</p>
                )}
              </div>
            </div>

            {/* Comment volume — Bar chart */}
            <div className="bg-white rounded-2xl border border-warm-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-brand" />
                </div>
                <span className="text-[0.8125rem] font-bold text-text-primary uppercase tracking-wider">Comment Volume Trends</span>
              </div>
              <div className="px-4 py-5">
                {volumeChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={volumeChart} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6d6d80" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#6d6d80" }} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                      <Bar dataKey="total"   name="Total"   fill="#e8e8ed" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="replied" name="Replied" fill={BRAND}   radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-text-muted text-[0.8125rem] py-12">No comment data for this period</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Top commenters ── */}
          <div className="bg-white rounded-2xl border border-warm-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-brand" />
                </div>
                <span className="text-[0.8125rem] font-bold text-text-primary uppercase tracking-wider">Top Commenters</span>
              </div>
              <span className="text-[0.6875rem] font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
                Last {days} days
              </span>
            </div>
            {topCommenters.length > 0 ? (
              <div className="divide-y divide-warm-border/50">
                {topCommenters.map((user, i) => {
                  const maxComments = topCommenters[0].comments;
                  const pct = Math.round((user.comments / maxComments) * 100);
                  return (
                    <div key={user.name} className="px-6 py-4 flex items-center gap-4">
                      <span className={`w-6 text-center text-[0.75rem] font-black shrink-0 ${
                        i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-text-muted"
                      }`}>
                        {i === 0 ? <Award className="w-4 h-4 inline" /> : `#${i + 1}`}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                        <span className="text-[0.6875rem] font-black text-brand">{initials(user.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.875rem] font-bold text-text-primary truncate">{user.name}</p>
                        <div className="mt-1.5 h-1.5 bg-warm-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[0.875rem] font-black text-text-primary shrink-0">{user.comments}</span>
                      <span className="text-[0.75rem] text-text-muted shrink-0">comments</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-text-muted text-[0.8125rem] py-8">No commenters found for this period</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
