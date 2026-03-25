const AIIllustration = () => (
  <div className="relative w-full max-w-[480px] mx-auto select-none">
    {/* Background card */}
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100 p-8 shadow-sm">

      {/* Top label */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 font-inter">AI Processing Pipeline</span>
      </div>

      {/* Main flow */}
      <div className="flex items-center justify-between gap-3">

        {/* Input: YouTube comment */}
        <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
              {/* White play triangle — clearly visible at small sizes */}
              <svg viewBox="0 0 10 12" className="w-3 h-3 fill-white ml-0.5" aria-hidden="true">
                <path d="M0 0L10 6L0 12V0Z"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">New Comment</span>
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed font-inter">"This video helped me so much! Do you have more tutorials like this?"</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
              <span className="text-[8px] font-bold text-white leading-none">U</span>
            </div>
            <span className="text-[10px] text-neutral-400">@user · 2m ago</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-6 h-px bg-orange-300"></div>
          <svg className="w-3 h-3 text-orange-400" viewBox="0 0 12 12" fill="currentColor">
            <path d="M9 6L4 1v10z"/>
          </svg>
        </div>

        {/* AI Core */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" aria-hidden="true">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 16.5 13z"/>
            </svg>
          </div>
          <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wide">BeyondChats AI</span>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-6 h-px bg-orange-300"></div>
          <svg className="w-3 h-3 text-orange-400" viewBox="0 0 12 12" fill="currentColor">
            <path d="M9 6L4 1v10z"/>
          </svg>
        </div>

        {/* Output: AI reply */}
        <div className="flex-1 bg-white rounded-2xl border border-green-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Auto-replied</span>
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed font-inter">"So glad it helped! 🙌 Yes, check our playlist for more — new tutorials every week!"</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-[7px] font-bold text-orange-600">BC</span>
            </div>
            <span className="text-[10px] text-neutral-400">You · just now</span>
          </div>
        </div>
      </div>

      {/* Bottom: powered by badges */}
      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-[10px] text-neutral-400 font-inter uppercase tracking-wide">Powered by</span>
        <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.387 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.402-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
          </svg>
          OpenAI
        </span>
        <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#D97757]" aria-hidden="true">
            <path d="M17.3 3.4c-1.4-.8-3-.8-4.3 0L4.3 8.2C3 9 2.2 10.4 2.2 12s.8 3 2.1 3.8l8.7 4.8c1.3.7 2.9.7 4.2 0l8.7-4.8c1.3-.8 2.1-2.2 2.1-3.8s-.8-3-2.1-3.8z"/>
          </svg>
          Anthropic
        </span>
        <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-neutral-500" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          + more
        </span>
      </div>
    </div>
  </div>
);

export const AISection = () => {
  return (
    <section className="max-w-none mx-auto px-4 py-12 md:max-w-[1230px] md:px-6 md:py-16">
      <div className="flex flex-col gap-10 items-center md:flex-row md:gap-16 md:items-center">

        {/* Illustration */}
        <div className="w-full md:w-1/2">
          <AIIllustration />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-4">
            AI-Powered
          </span>
          <h2 className="text-3xl font-semibold tracking-tight leading-snug mb-4 font-degular_display md:text-5xl md:leading-[1.1]">
            Make your replies smarter with AI
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed mb-5 font-inter">
            Level up your YouTube comment automation with AI. Extract,
            summarize, and craft perfectly timed responses using leading AI
            models like{" "}
            <a
              href="/apps/openai/integrations"
              className="text-orange-600 font-semibold hover:underline"
            >
              OpenAI
            </a>
            ,{" "}
            <a
              href="/apps/anthropic-claude/integrations"
              className="text-orange-600 font-semibold hover:underline"
            >
              Anthropic
            </a>
            , and more — all without writing a single line of code.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3 mb-8">
            {[
              "Detects comment intent & sentiment automatically",
              "Generates human-like, on-brand replies in seconds",
              "Works with OpenAI GPT, Claude, and custom models",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg viewBox="0 0 16 16" className="w-3 h-3 fill-orange-600" aria-hidden="true">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                  </svg>
                </span>
                <span className="text-sm text-neutral-600 font-inter leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>

          <a
            href="/ai"
            className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline font-inter"
          >
            Learn about AI automation
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-orange-600" aria-hidden="true">
              <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
