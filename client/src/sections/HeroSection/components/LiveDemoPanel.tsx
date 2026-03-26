import { useState, useEffect, useRef } from "react";

const DEMO_STEPS = [
  {
    id: "comment",
    user: "Alex Johnson",
    initials: "AJ",
    text: "Great video! How do I get started with the API?",
    time: "2 minutes ago",
  },
  {
    id: "thinking",
    label: "BeyondChats AI is analyzing...",
  },
  {
    id: "reply",
    user: "BeyondChats AI",
    text: "Thanks Alex! You can find our API documentation at docs.beyondchats.com — feel free to ask if you have any questions!",
    time: "Just now",
  },
];

const STEP_LABELS = ["Idle", "New comment", "Analyzing", "Reply sent"];

const AnimationFallback = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % (DEMO_STEPS.length + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="live-demo-root"
      className="w-full max-w-5xl mx-auto mt-10 mb-12 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden"
    >
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
        </div>
        <span className="text-xs font-medium text-neutral-500 tracking-wide">
          Live Demo — BeyondChats AI
        </span>
        <span className="text-xs text-orange-500 font-semibold uppercase tracking-widest">
          {step === 0 ? "Watching..." : STEP_LABELS[step]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] min-h-[380px]">
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-neutral-200">
          <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-white font-bold text-sm">YouTube Comments</span>
          </div>

          <div className="flex-1 p-4 space-y-4 bg-slate-50 overflow-y-auto custom-scrollbar">
            {step === 0 && (
              <div className="flex flex-col gap-3">
                <div className="h-3 bg-neutral-200 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded-full w-1/2 animate-pulse"></div>
                <p className="text-xs text-neutral-400 text-center mt-4">Waiting for new comments...</p>
              </div>
            )}

            {step >= 1 && (
              <div className="flex gap-3 animate-slide-up">
                <div className="w-9 h-9 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-orange-600">AJ</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-neutral-800">{DEMO_STEPS[0].user}</span>
                    <span className="text-xs text-neutral-400">{DEMO_STEPS[0].time}</span>
                  </div>
                  <div className="bg-white text-sm text-neutral-700 p-3 rounded-xl rounded-tl-none shadow-sm border border-neutral-100 leading-relaxed">
                    {DEMO_STEPS[0].text}
                  </div>
                </div>
              </div>
            )}

            {step >= 3 && (
              <div className="flex gap-3 animate-slide-up pl-4">
                <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xs font-bold text-white">BC</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-orange-700">{DEMO_STEPS[2].user}</span>
                    <span className="text-xs text-neutral-400">{DEMO_STEPS[2].time}</span>
                    <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">Auto-replied</span>
                  </div>
                  <div className="bg-orange-50 text-sm text-neutral-700 p-3 rounded-xl rounded-tl-none border border-orange-100 shadow-sm leading-relaxed">
                    {DEMO_STEPS[2].text}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 px-4 sm:px-6 py-6 sm:py-8 bg-white md:min-w-[140px]">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
              step === 2
                ? "bg-orange-600 scale-110 shadow-orange-200 animate-pulse"
                : "bg-orange-500 scale-100 shadow-orange-100"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white" aria-hidden="true">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 16.5 13z"/>
            </svg>
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-neutral-700 tracking-wide">AI Engine</p>
            {step === 2 ? (
              <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-widest animate-pulse">Processing...</p>
            ) : step === 3 ? (
              <p className="text-[10px] font-semibold text-green-600 uppercase tracking-widest">Done</p>
            ) : (
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Standby</p>
            )}
          </div>

          <div className="hidden md:flex flex-col items-center gap-1 mt-2">
            <div className={`w-px h-8 transition-colors duration-300 ${step >= 1 ? "bg-orange-400" : "bg-neutral-200"}`}></div>
            <svg className={`w-3 h-3 transition-colors duration-300 ${step >= 1 ? "text-orange-400" : "text-neutral-200"}`} viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L1 3h10z"/>
            </svg>
            <div className={`w-px h-8 transition-colors duration-300 ${step >= 3 ? "bg-orange-400" : "bg-neutral-200"}`}></div>
            <svg className={`w-3 h-3 transition-colors duration-300 ${step >= 3 ? "text-orange-400" : "text-neutral-200"}`} viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L1 3h10z"/>
            </svg>
          </div>
        </div>

        <div className="flex flex-col bg-neutral-950">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-neutral-800">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono tracking-wider">beyondchats-console v2.0.4</span>
          </div>

          <div className="flex-1 p-4 font-mono text-xs space-y-2.5 overflow-y-auto custom-scrollbar">
            <p className="text-green-400">$ beyondchats start --watch youtube</p>
            <p className="text-neutral-500">Connected to channel <span className="text-neutral-400">'BeyondChats'</span></p>
            <p className="text-neutral-600">Listening for new comments...</p>

            {step >= 1 && (
              <div className="animate-fade-in space-y-1 pt-1">
                <p className="text-neutral-700">──────────────────────</p>
                <p>
                  <span className="text-yellow-400 font-bold">[INCOMING]</span>
                  <span className="text-neutral-300"> @AlexJohnson</span>
                </p>
                <p className="text-neutral-400 pl-2">"Great video! How do I get started..."</p>
              </div>
            )}

            {step >= 2 && (
              <div className="animate-fade-in space-y-1.5 pt-1">
                <p>
                  <span className="text-blue-400 font-bold">[ANALYSIS]</span>
                  <span className="text-neutral-400"> Sentiment: </span>
                  <span className="text-green-400">Positive</span>
                </p>
                <p>
                  <span className="text-blue-400 font-bold">[INTENT]</span>
                  <span className="text-neutral-400"> Question → Documentation</span>
                </p>
                <p>
                  <span className="text-purple-400 font-bold">[GENERATE]</span>
                  <span className="text-neutral-400"> Using GPT-4o...</span>
                </p>
              </div>
            )}

            {step >= 3 && (
              <div className="animate-slide-up space-y-1 pt-1">
                <p>
                  <span className="text-green-400 font-bold">[SUCCESS]</span>
                  <span className="text-neutral-300"> Reply posted</span>
                </p>
                <p className="text-neutral-600">Response time: <span className="text-green-500">1.2s</span></p>
              </div>
            )}

            <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse mt-2 align-middle"></span>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 border-t border-neutral-200 px-4 py-3 flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === i ? "w-8 bg-orange-500" : "w-2 bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
        <span className="ml-3 text-xs text-neutral-400">
          Step {step + 1} of 4
        </span>
      </div>
    </div>
  );
};

export const LiveDemoPanel = () => {
  const [videoStatus, setVideoStatus] = useState<"loading" | "ready" | "error">("loading");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setVideoStatus("ready");
    const handleError = () => setVideoStatus("error");

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    const source = video.querySelector("source");
    if (source) source.addEventListener("error", handleError);

    // Fallback timeout - if video doesn't load in 15 seconds, show animation
    const timeout = setTimeout(() => {
      if (videoRef.current && videoRef.current.readyState < 3) {
        setVideoStatus("error");
      }
    }, 15000);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      if (source) source.removeEventListener("error", handleError);
      clearTimeout(timeout);
    };
  }, []);

  const videoSrc = "https://res.cloudinary.com/djbuumzmi/video/upload/c_crop,g_center,ar_16:10/v1774516176/demo-video_ghh6ym.mp4";

  return (
    <>
      {videoStatus !== "error" && (
        <div
          className={`w-full max-w-3xl mx-auto mt-10 mb-12 rounded-2xl border-2 border-orange-200 shadow-xl overflow-hidden ${
            videoStatus === "loading" ? "hidden" : ""
          }`}
        >
          <video
            ref={videoRef}
            className="w-full block"
            autoPlay
            loop
            muted
            playsInline
            src={videoSrc}
          />
        </div>
      )}

      {(videoStatus === "loading" || videoStatus === "error") && <AnimationFallback />}
    </>
  );
};
