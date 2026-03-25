const steps = [
  {
    number: "1",
    label: "Trigger",
    app: "YouTube",
    event: "New comment received",
    color: "bg-red-50 border-red-200",
    labelColor: "text-red-600 bg-red-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-600" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    detail: "Monitors your channel 24/7 for new comments",
  },
  {
    number: "2",
    label: "AI Process",
    app: "BeyondChats AI",
    event: "Analyze & generate reply",
    color: "bg-orange-50 border-orange-200",
    labelColor: "text-orange-600 bg-orange-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-orange-600" aria-hidden="true">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 16.5 13z"/>
      </svg>
    ),
    detail: "Detects sentiment, intent, and crafts a human-like response",
  },
  {
    number: "3",
    label: "Action",
    app: "YouTube",
    event: "Post reply to comment",
    color: "bg-green-50 border-green-200",
    labelColor: "text-green-700 bg-green-100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-600" aria-hidden="true">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    ),
    detail: "Posts the AI-generated reply via the YouTube API securely",
  },
];

export const WorkflowEditorPreview = () => {
  return (
    <div className="flex justify-center py-10 md:py-12">
      <div className="w-full max-w-3xl">
        {/* Editor chrome header */}
        <div className="bg-neutral-800 rounded-t-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <span className="text-neutral-400 text-xs font-mono">beyondchats-workflow-editor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-inter">YouTube Comment Auto-Reply</span>
            <span className="text-[10px] bg-green-600 text-white font-semibold px-2 py-0.5 rounded-full">Live</span>
          </div>
        </div>

        {/* Workflow canvas */}
        <div className="bg-neutral-50 border border-neutral-200 border-t-0 rounded-b-xl p-6 md:p-10"
          style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          <div className="flex flex-col items-center gap-0">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex flex-col items-center w-full max-w-sm">
                {/* Step card */}
                <div className={`w-full rounded-2xl border-2 ${step.color} bg-white shadow-sm px-4 py-4 flex items-start gap-3`}>
                  {/* App icon circle */}
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${step.labelColor}`}>
                        {step.label}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">{step.app}</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 leading-snug">{step.event}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{step.detail}</p>
                  </div>
                  <span className="text-xs font-bold text-neutral-300 shrink-0">{step.number}</span>
                </div>

                {/* Connector arrow (not after last) */}
                {idx < steps.length - 1 && (
                  <div className="flex flex-col items-center my-1">
                    <div className="w-0.5 h-5 bg-orange-300"></div>
                    <svg className="w-3 h-3 text-orange-400" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 9L1 4h10z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {/* Success badge */}
            <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 shadow-sm">
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold text-green-700">Workflow active — running 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
