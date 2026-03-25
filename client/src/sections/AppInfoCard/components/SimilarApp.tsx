export type SimilarAppProps = {
  appName: string;
  appHref: string;
  icon: React.ReactNode;
  categories: string[];
};

export const SimilarApp = (props: SimilarAppProps) => {
  return (
    <a
      href={props.appHref}
      className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white hover:border-orange-300 hover:shadow-sm transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
        {props.icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-neutral-800 group-hover:text-orange-700 transition-colors truncate font-inter">
          {props.appName}
        </div>
        <div className="text-xs text-neutral-500 truncate font-inter">
          {props.categories.join(" · ")}
        </div>
      </div>
    </a>
  );
};
