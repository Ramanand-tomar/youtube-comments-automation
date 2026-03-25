import { FAQItem } from "@/sections/FAQSection/components/FAQItem";

const faqs = [
  {
    question: "What is YouTube comment automation?",
    answer: "YouTube comment automation uses AI and workflow tools to automatically detect new comments on your videos and reply to them instantly — without you having to manually type a response every time. You set the rules once, and the system handles the rest.",
  },
  {
    question: "How does the AI generate comment replies?",
    answer: "The AI reads each incoming comment and generates a contextually relevant, on-brand response based on templates and tone settings you configure. You can also review or approve replies before they go live if preferred.",
  },
  {
    question: "Can I customize the tone and style of automated replies?",
    answer: "Yes. You can define your brand voice, set reply templates for different comment types (questions, compliments, negative feedback), and even use dynamic variables like the commenter's name for personalization.",
  },
  {
    question: "Will my audience know the replies are automated?",
    answer: "Your replies will appear like any other channel comment from your account. The AI generates natural, human-sounding responses, but how transparent you are with your audience is entirely up to you.",
  },
  {
    question: "Can I filter spam or negative comments automatically?",
    answer: "Yes. You can set keyword filters to detect, flag, or hide spam and inappropriate comments automatically, keeping your comment section clean without manual moderation.",
  },
  {
    question: "Do I need coding skills to set this up?",
    answer: "No coding is required. The setup process takes just a few minutes using a no-code visual workflow builder. Connect your YouTube account, configure your reply rules, and you're live.",
  },
  {
    question: "What happens if I want to reply manually to certain comments?",
    answer: "You remain in full control. You can pause automation for specific videos, set filters so only certain comment types get auto-replied, or review a queue before replies are posted.",
  },
];

export const FAQSection = () => {
  return (
    <section className="max-w-none mx-auto px-4 py-12 md:max-w-[1230px] md:px-6 md:py-16">
      {/* Header */}
      <div className="text-center mb-10 md:mb-12">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-4">
          FAQ
        </span>
        <h2 className="text-2xl font-semibold tracking-tight leading-snug max-w-none font-degular_display md:text-5xl md:leading-[1.1] md:max-w-[720px] md:mx-auto">
          Frequently Asked Questions
        </h2>
        <p className="text-neutral-500 text-sm mt-3 max-w-[520px] mx-auto leading-relaxed font-inter md:text-base">
          New to YouTube comment automation? Here are answers to the most common questions.
        </p>
      </div>

      {/* Two-column layout on desktop */}
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <div className="mt-10 text-center">
          <p className="text-sm text-neutral-500 font-inter">
            Still have questions?{" "}
            <a href="/dashboard" className="text-orange-600 font-semibold hover:underline">
              Try BeyondChats free
            </a>
            {" "}or{" "}
            <a href="/help/youtube-integration" className="text-orange-600 font-semibold hover:underline">
              read the docs
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
