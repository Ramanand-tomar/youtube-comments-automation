import { HeroHeading } from "@/sections/HeroSection/components/HeroHeading";
import { HeroFeatureList } from "@/sections/HeroSection/components/HeroFeatureList";
import { LiveDemoPanel } from "@/sections/HeroSection/components/LiveDemoPanel";

export const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-white overflow-hidden">
      <div className="max-w-none mx-auto px-4 py-12 md:max-w-[1230px] md:px-6 md:py-20">
        <HeroHeading data-uid="EonEo6HrhqhAgumV" />
        <LiveDemoPanel data-uid="live-demo-panel" />
        <HeroFeatureList data-uid="9FN6QclEBOThcNVp" />
      </div>
    </section>
  );
};
