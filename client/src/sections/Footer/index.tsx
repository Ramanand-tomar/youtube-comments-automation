const socialLinks = [
  {
    href: "http://www.facebook.com/BeyondChatsApp",
    label: "Follow us on Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
    bg: "bg-[#1877F2]",
  },
  {
    href: "https://www.linkedin.com/company/BeyondChats/",
    label: "Follow us on LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    bg: "bg-[#0A66C2]",
  },
  {
    href: "https://x.com/BeyondChats",
    label: "Follow @BeyondChats on X",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    bg: "bg-neutral-900",
  },
  {
    href: "https://www.youtube.com/@BeyondChats",
    label: "See BeyondChats videos on YouTube",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    bg: "bg-[#FF0000]",
  },
  {
    href: "/blog/feeds/latest/",
    label: "Subscribe to our blog RSS",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
        <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
      </svg>
    ),
    bg: "bg-orange-500",
  },
];

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/app/get-help", label: "Help" },
  { href: "/developer-platform/integrations", label: "Developer Platform" },
  { href: "/press", label: "Press" },
  { href: "/jobs", label: "Jobs" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/templates", label: "Templates" },
  { href: "/apps", label: "App Integrations" },
  { href: "/l/partners", label: "Partners Program" },
];

export const Footer = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 w-full px-5 py-10 font-inter">
      <div className="max-w-[1200px] mx-auto">

        {/* Top row: social + nav */}
        <div className="flex flex-col gap-6 justify-between md:flex-row md:items-center md:gap-8">

          {/* Social icons */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-neutral-500 text-sm">Follow us</span>
            <ul className="flex items-center gap-2 list-none p-0 m-0">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${social.bg} hover:opacity-80 transition-opacity`}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 list-none p-0 m-0 md:justify-end">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-700 text-sm font-medium hover:text-orange-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-200 my-8" />

        {/* Bottom row: logo + legal */}
        <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:gap-8">
          <a href="/" aria-label="BeyondChats home" className="shrink-0">
            <span className="text-2xl font-bold text-neutral-900 font-degular_display">
              BeyondChats
            </span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-neutral-500 md:justify-end">
            <span>© 2026 BeyondChats Inc.</span>
            <button className="hover:text-neutral-700 transition-colors cursor-pointer bg-transparent border-0 p-0 text-sm text-neutral-500">
              Manage cookies
            </button>
            <a href="/legal" className="hover:text-neutral-700 transition-colors">Legal</a>
            <a href="/privacy" className="hover:text-neutral-700 transition-colors">Privacy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
