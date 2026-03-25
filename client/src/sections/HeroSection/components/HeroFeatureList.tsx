const features = [
  "AI-powered comment replies",
  "Sentiment Analysis & Filtering",
  "24/7 Community Engagement",
  "Easy Setup, No Code Needed",
  "Secure YouTube API Integration",
  "Free Tier for Creators",
];

export const HeroFeatureList = () => {
  return (
    <div className="flex justify-center my-4">
      <ul className="text-stone-600 text-sm flex flex-wrap justify-center gap-x-6 gap-y-3 list-none pl-0 font-inter max-w-[800px]">
        {features.map((feature) => (
          <li key={feature} className="items-center flex gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-orange-500 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
