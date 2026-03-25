import { SimilarApp } from "@/sections/AppInfoCard/components/SimilarApp";

export type Category = {
  href: string;
  label: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type SimilarAppItem = {
  appName: string;
  appHref: string;
  icon: React.ReactNode;
  categories: string[];
};

export type AppInfoCardProps = {
  appIcon: React.ReactNode;
  appName: string;
  appIntegrationHref: string;
  breadcrumbs: BreadcrumbItem[];
  integrationTitle: string;
  appDescription: string;
  learnMoreHref: string;
  helpHref: string;
  relatedCategories: Category[];
  relatedApps: SimilarAppItem[];
};

export const AppInfoCard = (props: AppInfoCardProps) => {
  const {
    appIcon,
    appName,
    appIntegrationHref,
    breadcrumbs,
    integrationTitle,
    appDescription,
    learnMoreHref,
    helpHref,
    relatedCategories,
    relatedApps,
  } = props;

  return (
    <section className="max-w-none mx-auto px-4 py-8 md:max-w-[1230px] md:px-6 md:py-10">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-10">

          {/* Left: Logo + About */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav aria-label={`${appName} navigation`} className="mb-4">
              <ol className="flex flex-wrap items-center gap-1 list-none p-0">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center gap-1">
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-xs text-orange-600 font-semibold hover:underline font-inter"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-500 font-inter">{crumb.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <svg className="w-3 h-3 text-neutral-400" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* App identity */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                {appIcon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 leading-snug font-degular_display md:text-2xl">
                  {integrationTitle}
                </h3>
                <span className="text-xs text-neutral-500 font-inter">{appName}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-relaxed font-inter mb-5 md:text-base">
              {appDescription}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={learnMoreHref}
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors font-inter"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/>
                </svg>
                Learn more
              </a>
              <a
                href={helpHref}
                className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors font-inter"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7 5.5a1 1 0 1 1 2 0c0 .55-.45.83-.75 1.06C7.96 6.86 7.5 7.27 7.5 8v.5h1V8c0-.1.15-.25.44-.46.55-.4 1.06-.9 1.06-2.04a2 2 0 1 0-4 0H7v-.5c0-.28.22-.5.5-.5h-.5zM7.5 10h1v1.5h-1V10z"/>
                </svg>
                Help
              </a>
            </div>
          </div>

          {/* Right: Tags + Related */}
          <div className="flex flex-col gap-5 md:w-[300px] md:shrink-0">
            {/* Related categories */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-3 font-inter">
                Related categories
              </span>
              <div className="flex flex-wrap gap-2">
                {relatedCategories.map((category, index) => (
                  <a
                    key={index}
                    href={category.href}
                    className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full hover:bg-orange-100 transition-colors font-inter"
                  >
                    {category.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Related features */}
            {relatedApps.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-3 font-inter">
                  Related features
                </span>
                <div className="flex flex-col gap-2">
                  {relatedApps.map((app, index) => (
                    <SimilarApp
                      key={index}
                      appName={app.appName}
                      appHref={app.appHref}
                      icon={app.icon}
                      categories={app.categories}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
