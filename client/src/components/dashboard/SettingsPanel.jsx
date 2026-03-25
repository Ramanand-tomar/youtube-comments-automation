import { useState, useEffect } from "react";
import { api } from "../../api/client";
import {
  Save, Zap, Loader2, Bot, Clock, CheckCircle,
  AlertCircle, Sparkles, ShieldCheck, Activity, Video,
} from "lucide-react";


const INTERVALS = [
  { label: "1 min",   sublabel: "Real-time",  value: "*/1 * * * *" },
  { label: "5 min",   sublabel: "Fast",        value: "*/5 * * * *" },
  { label: "10 min",  sublabel: "Balanced",    value: "*/10 * * * *" },
  { label: "30 min",  sublabel: "Moderate",    value: "*/30 * * * *" },
  { label: "1 hour",  sublabel: "Relaxed",     value: "0 * * * *" },
];

const MAX_PROMPT = 2000;

function SectionCard({ icon: Icon, title, badge, children }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand" />
          </div>
          <span className="text-[0.8125rem] font-bold text-text-primary uppercase tracking-wider">{title}</span>
        </div>
        {badge && (
          <span className="text-[0.6875rem] font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function SettingsPanel({ onTrigger, onSettingsSaved, videos = [] }) {
  const [settings, setSettings]         = useState(null);
  const [savedSettings, setSavedSettings] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [triggering, setTriggering]     = useState(false);
  const [message, setMessage]           = useState("");
  const [isError, setIsError]           = useState(false);

  useEffect(() => {
    api.getSettings()
      .then((data) => {
        setSettings(data);
        setSavedSettings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hasChanges = settings && savedSettings && (
    settings.autoReplyEnabled !== savedSettings.autoReplyEnabled ||
    settings.cronInterval !== savedSettings.cronInterval ||
    settings.aiPromptTemplate !== savedSettings.aiPromptTemplate ||
    settings.autoReplyMode !== savedSettings.autoReplyMode ||
    JSON.stringify(settings.autoReplyVideoIds) !== JSON.stringify(savedSettings.autoReplyVideoIds)
  );

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSavedSettings(updated);
      onSettingsSaved?.(updated);
      setIsError(false);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setIsError(true);
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await api.triggerJob();
      setIsError(false);
      setMessage("Job triggered! Fetching and replying to comments now.");
      onTrigger?.();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setIsError(true);
      setMessage(`Error: ${err.message}`);
    } finally {
      setTriggering(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="w-full space-y-5 animate-pulse">
        {/* Header skeleton */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-200 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 bg-orange-200 rounded" />
              <div className="h-3 w-64 bg-orange-100 rounded" />
            </div>
            <div className="h-7 w-16 bg-orange-200 rounded-full" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 rounded-xl px-4 py-4 space-y-2">
                <div className="w-4 h-4 bg-orange-100 rounded mx-auto" />
                <div className="h-3 w-12 bg-orange-100 rounded mx-auto" />
                <div className="h-4 w-16 bg-orange-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-gray-200 rounded-lg" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
              <div className="h-10 w-14 bg-gray-200 rounded-full ml-auto" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-gray-200 rounded-lg" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        {/* Prompt skeleton */}
        <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
          <div className="px-6 py-4 border-b border-warm-border bg-warm-gray/40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-200 rounded-lg" />
              <div className="h-4 w-36 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="p-6 space-y-3">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-36 w-full bg-gray-100 rounded-xl" />
            <div className="h-1.5 w-full bg-gray-100 rounded-full" />
          </div>
        </div>
        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
          <div className="flex-1 h-12 bg-gray-100 rounded-xl border border-gray-200" />
        </div>
      </div>
    );
  }

  const promptLen = (settings.aiPromptTemplate || "").length;
  const promptPct = Math.min((promptLen / MAX_PROMPT) * 100, 100);

  return (
    <div className="w-full space-y-5">

      {/* ── Hero header ── */}
      <div className="relative bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6 overflow-hidden border border-orange-200">
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-200/40 rounded-full" />
        <div className="absolute -bottom-6 -right-4 w-20 h-20 bg-orange-200/40 rounded-full" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-[1.125rem] font-bold text-text-primary">Automation Settings</h2>
              <p className="text-[0.8125rem] text-orange-700 mt-0.5">
                Configure how BeyondChats AI handles your YouTube comments
              </p>
            </div>
          </div>

          {/* Live status badge */}
          <div className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
            settings.autoReplyEnabled
              ? "bg-green-100 border-green-300 text-green-700"
              : "bg-white border-orange-200 text-orange-500"
          }`}>
            <span className={`w-2 h-2 rounded-full ${settings.autoReplyEnabled ? "bg-green-500 animate-pulse" : "bg-orange-400"}`} />
            {settings.autoReplyEnabled ? "Active" : "Paused"}
          </div>
        </div>

        {/* Mini stats row */}
        <div className="relative mt-5 grid grid-cols-3 gap-3">
          {[
            { icon: Activity,    label: "Status",   value: settings.autoReplyEnabled ? "Running" : "Off" },
            { icon: Clock,       label: "Interval", value: INTERVALS.find(i => i.value === settings.cronInterval)?.label ?? "—" },
            { icon: ShieldCheck, label: "Mode",     value: settings.autoReplyMode === "selected" ? "Selected" : "All Videos" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/70 border border-orange-200 rounded-xl px-4 py-3 text-center">
              <Icon className="w-4 h-4 text-brand mx-auto mb-1" />
              <p className="text-[0.75rem] text-orange-600">{label}</p>
              <p className="text-[0.875rem] font-bold text-text-primary mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-column grid (desktop) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Auto-Reply toggle */}
        <SectionCard icon={Sparkles} title="Auto-Reply">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.9375rem] font-semibold text-text-primary leading-snug">
                Enable automatic replies
              </p>
              <p className="text-[0.8125rem] text-text-muted mt-1 leading-relaxed">
                AI will instantly reply to every new comment on your channel.
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoReplyEnabled: !settings.autoReplyEnabled })}
              className={`relative shrink-0 w-13 h-7 rounded-full transition-all duration-300 cursor-pointer mt-0.5 ${
                settings.autoReplyEnabled
                  ? "bg-brand shadow-md shadow-brand/30"
                  : "bg-warm-border"
              }`}
              style={{ width: "3.25rem" }}
              aria-label="Toggle auto-reply"
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                settings.autoReplyEnabled ? "left-[calc(100%-1.375rem)]" : "left-1"
              }`} />
            </button>
          </div>

          <div className={`mt-4 rounded-xl px-4 py-3 flex items-center gap-2.5 text-[0.8125rem] font-medium transition-all ${
            settings.autoReplyEnabled
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-warm-gray border border-warm-border text-text-muted"
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              settings.autoReplyEnabled ? "bg-green-500 animate-pulse" : "bg-neutral-300"
            }`} />
            {settings.autoReplyEnabled
              ? "AI is actively monitoring your channel"
              : "Auto-reply is currently disabled"}
          </div>
        </SectionCard>

        {/* Check interval */}
        <SectionCard icon={Clock} title="Check Interval" badge="Cron">
          <p className="text-[0.8125rem] text-text-muted mb-4">
            How often should BeyondChats scan for new comments?
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {INTERVALS.map((interval) => {
              const active = settings.cronInterval === interval.value;
              return (
                <button
                  key={interval.value}
                  onClick={() => setSettings({ ...settings, cronInterval: interval.value })}
                  className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all cursor-pointer text-center ${
                    active
                      ? "border-brand bg-brand/5 shadow-sm shadow-brand/10"
                      : "border-warm-border hover:border-brand/40 hover:bg-warm-gray"
                  }`}
                >
                  <span className={`text-[0.9375rem] font-bold ${active ? "text-brand" : "text-text-primary"}`}>
                    {interval.label}
                  </span>
                  <span className={`text-[0.6875rem] mt-0.5 ${active ? "text-brand/70" : "text-text-muted"}`}>
                    {interval.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* Video scope */}
        <SectionCard icon={Video} title="Video Scope" badge={settings.autoReplyMode === "selected" ? `${(settings.autoReplyVideoIds || []).length} selected` : "All"}>
          <p className="text-[0.8125rem] text-text-muted mb-4">
            Choose which videos the AI should auto-reply to.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "all",      label: "All Videos",      sublabel: "Reply everywhere" },
              { value: "selected", label: "Selected Only",   sublabel: "Pick specific videos" },
            ].map((opt) => {
              const active = settings.autoReplyMode === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSettings({ ...settings, autoReplyMode: opt.value })}
                  className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all cursor-pointer text-center ${
                    active
                      ? "border-brand bg-brand/5 shadow-sm shadow-brand/10"
                      : "border-warm-border hover:border-brand/40 hover:bg-warm-gray"
                  }`}
                >
                  <span className={`text-[0.9375rem] font-bold ${active ? "text-brand" : "text-text-primary"}`}>
                    {opt.label}
                  </span>
                  <span className={`text-[0.6875rem] mt-0.5 ${active ? "text-brand/70" : "text-text-muted"}`}>
                    {opt.sublabel}
                  </span>
                </button>
              );
            })}
          </div>

          {settings.autoReplyMode === "selected" && (
            <div className="mt-4 space-y-3">
              {videos.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-[0.75rem] font-semibold text-text-muted uppercase tracking-wide">Select videos</p>
                    <button
                      onClick={() => {
                        const allIds = videos.map((v) => v.videoId);
                        const allSelected = allIds.every((id) => (settings.autoReplyVideoIds || []).includes(id));
                        setSettings({
                          ...settings,
                          autoReplyVideoIds: allSelected ? [] : allIds,
                        });
                      }}
                      className="text-[0.75rem] font-bold text-brand hover:underline cursor-pointer"
                    >
                      {videos.every((v) => (settings.autoReplyVideoIds || []).includes(v.videoId)) ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                    {videos.map((v) => {
                      const enabled = (settings.autoReplyVideoIds || []).includes(v.videoId);
                      return (
                        <button
                          key={v.videoId}
                          onClick={() => {
                            const ids = settings.autoReplyVideoIds || [];
                            setSettings({
                              ...settings,
                              autoReplyVideoIds: enabled
                                ? ids.filter((id) => id !== v.videoId)
                                : [...ids, v.videoId],
                            });
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                            enabled
                              ? "border-brand bg-brand/5 shadow-sm shadow-brand/5"
                              : "border-warm-border hover:border-brand/30 hover:bg-warm-gray"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                            enabled ? "border-brand bg-brand" : "border-gray-300"
                          }`}>
                            {enabled && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[0.8125rem] font-semibold truncate ${enabled ? "text-brand" : "text-text-primary"}`}>
                              {v.videoTitle}
                            </p>
                            <p className="text-[0.6875rem] text-text-muted">{v.totalComments} comments</p>
                          </div>
                          <span className={`text-[0.625rem] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                          }`}>
                            {enabled ? "ON" : "OFF"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
                  <Video className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-[0.8125rem] text-orange-700 leading-relaxed">
                    No videos found. Sync your comments first to see videos here.
                  </p>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── AI Prompt — full width ── */}
      <SectionCard icon={Bot} title="AI Prompt Template" badge="Customisable">
        <p className="text-[0.8125rem] text-text-muted mb-4 leading-relaxed">
          This prompt guides the AI when generating replies. Be specific about tone, language, length, and style to get the best results.
        </p>

        <div className="relative">
          <textarea
            value={settings.aiPromptTemplate}
            onChange={(e) => {
              if (e.target.value.length <= MAX_PROMPT) {
                setSettings({ ...settings, aiPromptTemplate: e.target.value });
              }
            }}
            rows={7}
            placeholder="e.g. You are a friendly YouTube creator. Reply in 1-2 sentences, be warm and encouraging…"
            className="w-full border border-warm-border rounded-xl px-4 py-3.5 text-[0.875rem] font-mono text-text-secondary bg-[#fafafa] focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none resize-none transition leading-relaxed"
          />
          {/* Character counter bar */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex-1 h-1.5 bg-warm-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  promptPct > 90 ? "bg-red-400" : promptPct > 70 ? "bg-yellow-400" : "bg-brand"
                }`}
                style={{ width: `${promptPct}%` }}
              />
            </div>
            <span className={`text-[0.75rem] font-medium shrink-0 ${
              promptPct > 90 ? "text-red-500" : "text-text-muted"
            }`}>
              {promptLen} / {MAX_PROMPT}
            </span>
          </div>
        </div>

        {/* Quick tip */}
        <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <p className="text-[0.8125rem] text-orange-700 leading-relaxed">
            <span className="font-bold">Tip:</span> Mention your channel name, preferred tone (friendly/professional), and max reply length for the most on-brand responses.
          </p>
        </div>
      </SectionCard>

      {/* ── Status message ── */}
      {message && (
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-[0.875rem] font-medium ${
          isError
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {isError
            ? <AlertCircle className="w-5 h-5 shrink-0" />
            : <CheckCircle className="w-5 h-5 shrink-0" />
          }
          <span>{message}</span>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={`flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-[0.9375rem] font-semibold transition-all active:scale-[0.98] ${
            hasChanges
              ? "bg-brand hover:bg-brand-dark text-white cursor-pointer hover:shadow-lg hover:shadow-brand/25 disabled:opacity-50"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
        <button
          onClick={handleTrigger}
          disabled={triggering}
          className="flex-1 inline-flex items-center justify-center gap-2.5 bg-white text-text-primary border-2 border-warm-border hover:border-brand hover:text-brand px-6 py-3.5 rounded-xl text-[0.9375rem] font-semibold disabled:opacity-50 transition-all cursor-pointer active:scale-[0.98]"
        >
          {triggering ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {triggering ? "Running…" : "Trigger Manual Run"}
        </button>
      </div>

    </div>
  );
}
