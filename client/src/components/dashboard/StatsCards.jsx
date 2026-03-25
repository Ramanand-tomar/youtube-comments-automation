import { MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function StatsCards({ videos }) {
  const total = videos.reduce((sum, v) => sum + v.totalComments, 0);
  const replied = videos.reduce((sum, v) => sum + v.repliedComments, 0);
  const unreplied = videos.reduce((sum, v) => sum + v.unrepliedComments, 0);

  const stats = [
    { label: "Total Comments", value: total, icon: MessageSquare, color: "text-brand", bg: "bg-brand-bg" },
    { label: "Replied", value: replied, icon: CheckCircle, color: "text-success", bg: "bg-success-bg" },
    { label: "Unreplied", value: unreplied, icon: Clock, color: "text-yt-red", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl border border-warm-border p-6 flex items-center gap-5 shadow-sm transition-all hover:shadow-md">
          <div className={`w-14 h-14 ${s.bg} rounded-xl flex items-center justify-center`}>
            <s.icon className={`w-6 h-6 ${s.color}`} />
          </div>
          <div>
            <p className="text-[1.75rem] font-black text-text-primary leading-none mb-1">{s.value}</p>
            <p className="text-[0.875rem] font-bold text-text-muted uppercase tracking-wider">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
