import { useState } from "react";

export type FAQItemProps = {
  question: string;
  answer: string;
};

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-xl transition-all duration-200 overflow-hidden ${
        open
          ? "border-orange-300 bg-orange-50/40 shadow-sm"
          : "border-neutral-200 bg-white hover:border-orange-200 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm md:text-base leading-snug font-inter transition-colors ${open ? "text-orange-700" : "text-neutral-800"}`}>
          {question}
        </span>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
          open ? "bg-orange-600 rotate-45" : "bg-neutral-100 rotate-0"
        }`}>
          <svg
            viewBox="0 0 16 16"
            className={`w-3.5 h-3.5 transition-colors ${open ? "text-white" : "text-neutral-500"}`}
            fill="currentColor"
          >
            <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2z"/>
          </svg>
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0">
          <div className="h-px bg-orange-100 mb-4"></div>
          <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-inter">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};
