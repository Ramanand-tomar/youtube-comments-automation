export const HeroHeading = () => {
  return (
    <hgroup className="items-center flex flex-col text-center px-4">
      <h1 className="text-3xl font-bold tracking-tight leading-tight max-w-none mb-6 font-degular_display md:text-6xl md:leading-[1.1] md:max-w-[1000px]">
        Scale Your YouTube Engagement with <span className="text-orange-600">BeyondChats AI</span>
      </h1>
      <p className="text-lg text-neutral-600 max-w-[800px] mb-8 font-inter md:text-xl md:leading-relaxed">
        Never miss a comment again. Automatically reply to your fans, filter spam, and grow your community with human-like AI responses that sound just like you.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-base px-6 py-3 rounded-lg transition-colors shadow-md shadow-orange-200"
        >
          Get Started Free
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
        <a
          href="#live-demo-root"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-orange-700 font-semibold text-base px-6 py-3 rounded-lg border border-orange-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Watch Demo
        </a>
      </div>
      <p className="text-xs text-neutral-400 mt-1">No credit card required · Free tier available</p>
    </hgroup>
  );
};
