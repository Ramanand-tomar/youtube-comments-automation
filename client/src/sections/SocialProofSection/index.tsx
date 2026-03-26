import { useState, useEffect, useRef } from "react";

const awards = [
  {
    title: "Best",
    subtitle: "AI Automation",
    badge: "Enterprise",
    badgeColor: "bg-brand",
    year: "2024",
  },
  {
    title: "Fastest",
    subtitle: "Response Time",
    badge: "WINTER",
    badgeColor: "bg-blue-500",
    year: "2024",
  },
  {
    title: "Most",
    subtitle: "Reliable",
    badge: "WINTER",
    badgeColor: "bg-cyan-500",
    year: "2024",
  },
  {
    title: "Top Rated",
    subtitle: "",
    badge: "FALL",
    badgeColor: "bg-red-500",
    year: "2024",
  },
];

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Comments replied automatically by creators using BeyondChats AI",
  },
  {
    value: 500,
    suffix: "+",
    label: "YouTube creators trust BeyondChats to engage their community",
  },
  {
    value: 3,
    suffix: " mins",
    label: "Average setup time — connect your channel and start in minutes",
  },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (!start || ref.current) return;
    ref.current = true;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [start, target, duration]);
  return count;
}

export function SocialProofSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#1a1145] overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
        {/* Heading */}
        <h2 className="text-center text-white text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-black leading-tight max-w-3xl mx-auto">
          Trusted by{" "}
          <span className="text-brand">500+ YouTube creators</span>{" "}
          to automate their comment engagement
        </h2>

        {/* Awards row */}
        <div className="mt-14 flex flex-wrap justify-center gap-6 sm:gap-8">
          {awards.map((a, i) => (
            <div
              key={i}
              className="relative w-[calc(50%-12px)] sm:w-[120px] group"
            >
              {/* Shield shape */}
              <div className="bg-white rounded-t-xl rounded-b-[2rem] px-4 pt-5 pb-6 text-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform">
                {/* Top icon */}
                <div className="w-7 h-7 mx-auto mb-2 bg-brand/10 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-brand">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <p className="text-[0.9375rem] font-black text-[#1a1145] leading-tight">
                  {a.title}
                </p>
                {a.subtitle && (
                  <p className="text-[0.75rem] font-bold text-[#1a1145] leading-tight">
                    {a.subtitle}
                  </p>
                )}
                <div className={`mt-2 ${a.badgeColor} text-white text-[0.5625rem] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm inline-block`}>
                  {a.badge}
                </div>
                <p className="text-[0.875rem] font-black text-[#1a1145] mt-1">
                  {a.year}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((s, i) => {
            const count = useCountUp(s.value, 2000, visible);
            return (
              <div
                key={i}
                className="border border-white/15 rounded-2xl px-6 py-7 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <p className="text-[2.5rem] sm:text-[3rem] font-black text-white leading-none">
                  {count.toLocaleString()}
                  <span className="text-brand">{s.suffix}</span>
                </p>
                <p className="mt-3 text-[0.875rem] text-white/70 leading-relaxed font-medium">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
