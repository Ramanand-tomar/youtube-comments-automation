import { useState, useRef, useEffect } from "react";

type DropdownItem = {
  label: string;
  href: string;
  description?: string;
  icon: React.ReactNode;
};

type NavItem = {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
};

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    className={`w-3.5 h-3.5 fill-current transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    aria-hidden="true"
  >
    <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
  </svg>
);

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Video Analytics", href: "/analytics" },
  { label: "Dashboard", href: "/dashboard" },
];

const DropdownMenu = ({ items }: { items: DropdownItem[] }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50">
    {items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-orange-50 transition-colors group"
      >
        <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
          {item.icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-800 leading-snug">{item.label}</div>
          {item.description && (
            <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.description}</div>
          )}
        </div>
      </a>
    ))}
  </div>
);

const NavItemComponent = ({ item }: { item: NavItem }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.dropdown) {
    const isActive = item.href && !item.href.startsWith("#") && window.location.pathname === item.href;
    return (
      <a
        href={item.href}
        className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? "text-orange-600 bg-orange-50 font-semibold"
            : "text-neutral-700 hover:text-orange-600 hover:bg-orange-50"
        }`}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          open ? "text-orange-600 bg-orange-50" : "text-neutral-700 hover:text-orange-600 hover:bg-orange-50"
        }`}
      >
        {item.label}
        <ChevronDown open={open} />
      </button>
      {open && <DropdownMenu items={item.dropdown} />}
    </div>
  );
};

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-neutral-200 font-inter">
      <div className="max-w-[1230px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Desktop nav */}
          <div className="flex items-center gap-6">
            <a href="/" aria-label="BeyondChats home" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-neutral-900 font-degular_display">BeyondChats</span>
            </a>

            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navItems.map((item) => (
                <NavItemComponent key={item.label} item={item} />
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <a
              href="/l/contact-sales"
              className="hidden md:block text-sm font-medium text-neutral-600 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Contact sales
            </a>
            <a
              href="/app/login"
              className="hidden md:block text-sm font-medium text-neutral-700 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Log in
            </a>
            <a
              href="/sign-up"
              className="text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full transition-colors ml-1"
            >
              Sign up
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors ml-2"
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-neutral-700" aria-hidden="true">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-neutral-700" aria-hidden="true">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.label}>
                  <div className="text-xs font-bold uppercase tracking-widest text-neutral-400 px-3 pt-3 pb-1">
                    {item.label}
                  </div>
                  {item.dropdown.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                        {sub.icon}
                      </div>
                      <span className="text-sm font-medium text-neutral-700">{sub.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-neutral-700 px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
          </nav>
          <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2">
            <a
              href="/app/login"
              className="text-sm font-medium text-neutral-700 px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </a>
            <a
              href="/sign-up"
              className="text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-full text-center transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign up free
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
