import { Video, ChevronRight, Bot } from "lucide-react";

export default function VideoList({
  videos,
  selectedVideoId,
  onSelectVideo,
  autoReplyMode,
  autoReplyVideoIds = [],
  onToggleVideoAutoReply,
}) {
  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-warm-border p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Video className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
        <p className="text-text-muted text-[0.8125rem]">No videos found yet. Use the <span className="font-semibold text-text-primary">Sync Comments</span> button to fetch your YouTube comments.</p>
      </div>
    );
  }

  const isVideoEnabled = (videoId) => {
    if (autoReplyMode !== "selected") return true;
    return autoReplyVideoIds.includes(videoId);
  };

  return (
    <div className="bg-white rounded-2xl border border-warm-border overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-warm-border bg-warm-gray/50">
        <h3 className="text-[0.9375rem] font-black text-text-primary uppercase tracking-wider">Your Videos</h3>
      </div>
      <div className="divide-y divide-warm-border/50 max-h-[450px] overflow-y-auto custom-scrollbar">
        <button
          onClick={() => onSelectVideo(null)}
          className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all cursor-pointer ${
            !selectedVideoId ? "bg-brand/5 border-l-4 border-brand" : "hover:bg-warm-gray border-l-4 border-transparent"
          }`}
        >
          <span className={`text-[0.9375rem] font-bold ${!selectedVideoId ? "text-brand" : "text-text-primary"}`}>All Videos</span>
          <ChevronRight className={`w-4 h-4 ${!selectedVideoId ? "text-brand" : "text-text-muted"}`} />
        </button>
        {videos.map((v) => {
          const enabled = isVideoEnabled(v.videoId);
          return (
            <div
              key={v.videoId}
              className={`flex items-center transition-all ${
                selectedVideoId === v.videoId ? "bg-brand/5 border-l-4 border-brand" : "hover:bg-warm-gray border-l-4 border-transparent"
              }`}
            >
              <button
                onClick={() => onSelectVideo(v.videoId)}
                className="flex-1 flex items-center justify-between px-6 py-4 text-left cursor-pointer min-w-0"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className={`text-[0.9375rem] font-bold truncate ${selectedVideoId === v.videoId ? "text-brand" : "text-text-primary"}`}>
                    {v.videoTitle}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[0.75rem] font-bold text-text-muted">{v.totalComments} comments</span>
                    <span className="text-[0.75rem] text-warm-border">|</span>
                    <span className="text-[0.75rem] font-bold text-success">{v.repliedComments} replied</span>
                  </div>
                </div>
              </button>
              {/* Auto-reply toggle per video */}
              {autoReplyMode === "selected" && onToggleVideoAutoReply && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVideoAutoReply(v.videoId);
                  }}
                  title={enabled ? "Auto-reply ON — click to disable" : "Auto-reply OFF — click to enable"}
                  className={`mr-4 shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.6875rem] font-bold transition-all cursor-pointer border ${
                    enabled
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  {enabled ? "ON" : "OFF"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
