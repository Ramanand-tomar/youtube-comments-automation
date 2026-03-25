import { HeroSection } from "@/sections/HeroSection";
import { TrustedCompanies } from "@/sections/TrustedCompanies";

import { HowItWorksSection } from "@/sections/HowItWorksSection";
import { AISection } from "@/sections/AISection";
import { FAQSection } from "@/sections/FAQSection";
import { AppInfoCard } from "@/sections/AppInfoCard";
import { FinalCTASection } from "@/sections/FinalCTASection";
import { SocialProofSection } from "@/sections/SocialProofSection";

const BeyondChatsIcon = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#ff4f00" opacity="0.12"/>
    <path d="M12 16a8 8 0 0 1 16 0c0 2.5-1 4.5-2.5 6l-5.5 6-5.5-6C13 20.5 12 18.5 12 16z" fill="#ff4f00"/>
    <circle cx="17" cy="16" r="1.5" fill="white"/>
    <circle cx="23" cy="16" r="1.5" fill="white"/>
    <path d="M17 20c.8 1.2 2 1.8 3 1.8s2.2-.6 3-1.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#FF0000" opacity="0.1"/>
    <path d="M32.5 14.5a3.5 3.5 0 0 0-2.46-2.48C27.8 11.5 20 11.5 20 11.5s-7.8 0-10.04.52A3.5 3.5 0 0 0 7.5 14.5C7 16.75 7 21.25 7 21.25s0 4.5.5 6.75a3.5 3.5 0 0 0 2.46 2.48C12.2 31 20 31 20 31s7.8 0 10.04-.52a3.5 3.5 0 0 0 2.46-2.48C33 25.75 33 21.25 33 21.25s0-4.5-.5-6.75z" fill="#FF0000"/>
    <path d="M17 25.5l7-4.25-7-4.25v8.5z" fill="white"/>
  </svg>
);

const SmartRepliesIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-orange-600" aria-hidden="true">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const ContentAnalysisIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-orange-600" aria-hidden="true">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 12H8v-1c0-2.67 2.67-4 4-4s4 1.33 4 4v1z"/>
  </svg>
);

const SentimentIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-orange-600" aria-hidden="true">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
  </svg>
);

export const Main = () => {
  return (
    <main className="relative flex-1">
      <HeroSection />
      <TrustedCompanies />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="features">
        <AISection />
      </div>
      <SocialProofSection />
      <div id="faq">
        <FAQSection />
      </div>
      <AppInfoCard
        appIcon={<BeyondChatsIcon />}
        appName="BeyondChats AI"
        appIntegrationHref="/dashboard"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "AI Automation" },
        ]}
        integrationTitle="About BeyondChats AI"
        appDescription="BeyondChats AI is a cutting-edge automation platform that handles your YouTube comments with human-like intelligence, ensuring your community stays engaged 24/7."
        learnMoreHref="/dashboard"
        helpHref="#"
        relatedCategories={[]}
        relatedApps={[
          {
            appName: "Smart Replies",
            appHref: "#",
            icon: <SmartRepliesIcon />,
            categories: ["AI Automation", "Community Engagement"],
          },
          {
            appName: "Sentiment Analysis",
            appHref: "#",
            icon: <SentimentIcon />,
            categories: ["AI Processing", "Moderation"],
          },
        ]}
      />
      <AppInfoCard
        appIcon={<YouTubeIcon />}
        appName="YouTube"
        appIntegrationHref="/dashboard"
        breadcrumbs={[
          { label: "Integrations", href: "#" },
          { label: "YouTube" },
        ]}
        integrationTitle="YouTube Comment Automation"
        appDescription="Connect BeyondChats to your YouTube channel to automatically track, analyze, and reply to comments. Perfect for creators who want to scale their engagement without losing the personal touch."
        learnMoreHref="/dashboard"
        helpHref="#"
        relatedCategories={[]}
        relatedApps={[
          {
            appName: "Content Analysis",
            appHref: "#",
            icon: <ContentAnalysisIcon />,
            categories: ["Analytics", "AI Processing"],
          },
        ]}
      />
      <FinalCTASection />
    </main>
  );
};
