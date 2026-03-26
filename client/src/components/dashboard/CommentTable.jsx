import { useState, useEffect } from "react";
import { api } from "../../api/client";
import { MessageSquare, Reply, Bot, Video } from "lucide-react";
import ManualReplyModal from "./ManualReplyModal";

export default function CommentTable({ selectedVideoId, refreshKey }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [replyTarget, setReplyTarget] = useState(null);

  const fetchComments = () => {
    setLoading(true);
    const params = {};
    if (selectedVideoId) params.videoId = selectedVideoId;
    if (filter === "replied") params.replied = "true";
    if (filter === "unreplied") params.replied = "false";

    api.getComments(params)
      .then(setComments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, [selectedVideoId, filter, refreshKey]);

  const filters = [
    { key: "all", label: "All" },
    { key: "replied", label: "Replied" },
    { key: "unreplied", label: "Unreplied" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-warm-border overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-warm-border bg-warm-gray/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-[0.9375rem] font-black text-text-primary uppercase tracking-wider">Comments</h3>
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-warm-border">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 text-[0.8125rem] font-bold rounded-lg transition-all cursor-pointer ${
                filter === f.key ? "bg-brand text-white shadow-md shadow-brand/20" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="divide-y divide-warm-border/50 p-6 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse pt-4 first:pt-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-100 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-4/5 bg-gray-100 rounded" />
              </div>
              {i % 2 === 0 && (
                <div className="mt-4 bg-gray-50 rounded-2xl p-4 space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-warm-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-muted text-[1rem] font-bold">No comments found.</p>
        </div>
      ) : (
        <div className="divide-y divide-warm-border/50 max-h-[600px] overflow-y-auto custom-scrollbar">
          {comments.map((c) => (
            <div key={c._id} className="px-6 py-6 hover:bg-warm-gray/30 transition-all group">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[0.9375rem] font-black text-text-primary">{c.author}</span>
                    <span className={`text-[0.7rem] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                      c.replied ? "bg-success-bg text-success border border-[#aff5b4]" : "bg-brand-bg text-brand border border-brand-bg-deep"
                    }`}>
                      {c.replied ? "Replied" : "Pending"}
                    </span>
                  </div>
                  {!selectedVideoId && (
                    <p className="text-[0.75rem] font-bold text-text-muted mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                      <Video className="w-3.5 h-3.5" />
                      {c.videoTitle}
                    </p>
                  )}
                  <p className="text-[1rem] text-text-secondary font-medium leading-relaxed">{c.text}</p>
                  
                  {c.commentReply && (
                    <div className="mt-4 bg-brand/5 rounded-2xl border border-brand/10 p-5 group-hover:bg-brand/10 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-brand" />
                        <span className="text-[0.75rem] font-black text-brand uppercase tracking-[0.1em]">AI Response</span>
                      </div>
                      <p className="text-[0.9375rem] text-text-primary font-medium leading-relaxed italic">"{c.commentReply}"</p>
                    </div>
                  )}
                </div>
                {!c.replied && (
                  <button
                    onClick={() => setReplyTarget(c)}
                    className="shrink-0 inline-flex items-center gap-2 bg-brand text-white px-4 sm:px-6 py-2.5 rounded-xl text-[0.8125rem] font-bold hover:shadow-lg hover:shadow-brand/20 transition-all cursor-pointer sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {replyTarget && (
        <ManualReplyModal
          comment={replyTarget}
          onClose={() => setReplyTarget(null)}
          onReplied={() => {
            setReplyTarget(null);
            fetchComments();
          }}
        />
      )}
    </div>
  );
}
