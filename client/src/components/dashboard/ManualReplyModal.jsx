import { useState } from "react";
import { api } from "../../api/client";
import { X, Send, Loader2 } from "lucide-react";

export default function ManualReplyModal({ comment, onClose, onReplied }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.postReply(comment.commentId, text.trim());
      onReplied();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-warm-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-border bg-warm-gray rounded-t-2xl">
          <h3 className="text-[0.9375rem] font-semibold text-text-primary">Reply to Comment</h3>
          <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-warm-gray rounded-xl border border-warm-border p-4">
            <p className="text-[0.75rem] text-text-muted font-semibold mb-1">{comment.author}</p>
            <p className="text-[0.8125rem] text-text-secondary">{comment.text}</p>
          </div>

          <div>
            <label className="block text-[0.875rem] font-medium text-text-primary mb-2">Your Reply</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="w-full border border-warm-border rounded-xl px-4 py-3 text-[0.875rem] text-text-primary bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none resize-none transition"
            />
          </div>

          {error && <p className="text-[0.8125rem] text-yt-red">{error}</p>}

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-[0.8125rem] text-text-muted hover:text-text-primary transition cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-full text-[0.8125rem] font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(80,62,189,0.3)]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
