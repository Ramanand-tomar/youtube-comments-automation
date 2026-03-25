export const FinalCTASection = () => {
  return (
    <div className="bg-neutral-800 px-0 py-2 md:px-5 md:py-6">
      <section className="max-w-[1230px] mx-auto px-5 py-12 md:max-w-[1200px] md:py-[72px]">
        <hgroup className="items-center flex flex-col text-center">
          <h2 className="text-stone-50 text-2xl font-semibold tracking-[1px] leading-8 max-w-none pb-0 font-degular_display md:text-5xl md:leading-[48px] md:max-w-[920px] md:pb-4">
            Start automating your YouTube comments today — free to get started, no code required
          </h2>
        </hgroup>
        <div className="pt-12">
          <div className="flex flex-col sm:flex-row gap-[18px] justify-center items-center">
            <a href="/dashboard">
              <button
                type="button"
                className="appearance-none text-stone-50 font-semibold bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-x-2 rounded-lg border-0 transition-colors font-inter text-sm h-9 px-4 md:text-lg md:h-12 md:px-5"
              >
                Get Started Free
              </button>
            </a>
            <a
              href="/dashboard"
              role="button"
              className="text-stone-50 font-semibold bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-x-2.5 rounded-lg transition-colors font-inter text-sm h-9 px-4 md:text-lg md:h-12 md:px-5"
            >
              <span className="items-center bg-stone-50 grid h-[22px] w-[22px] justify-items-center rounded-[4px] md:h-[26px] md:w-[26px]">
                <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] md:h-[18px] md:w-[18px]" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </span>
              Sign up with Google
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
