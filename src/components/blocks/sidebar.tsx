"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { name: "Home", path: "/home", icon: HomeIcon },
  { name: "Recently Added", path: "/browse?category=recently-added", icon: PlusCircleIcon },
  { name: "Top Upcoming", path: "/browse?category=top-upcoming", icon: CalendarIcon },
  { name: "Subbed Anime", path: "/browse?category=subbed-anime", icon: SubIcon },
  { name: "Dubbed Anime", path: "/browse?category=dubbed-anime", icon: DubIcon },
  { name: "Most Popular", path: "/browse?category=most-popular", icon: FireIcon },
  { name: "Movies", path: "/browse?category=movie", icon: FilmIcon },
  { name: "TV Series", path: "/browse?category=tv", icon: TvIcon },
  { name: "OVAs", path: "/browse?category=ova", icon: PlayIcon },
  { name: "ONAs", path: "/browse?category=ona", icon: PlayIcon },
  { name: "Specials", path: "/browse?category=special", icon: StarIcon },
  { name: "Schedule", path: "/schedule", icon: ClockIcon },
  { name: "Saved", path: "/saved", icon: BookmarkIcon },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const scrollPos = useRef(0);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      scrollPos.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPos.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPos.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] z-[70] bg-[oklch(0.08_0.01_260)] border-r border-border flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link href="/" className="font-heading text-xl text-foreground">
            ani<span className="text-cyan">flix</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 px-4 py-3 border-b border-border">
          <Link
            href="/browse"
            className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <SearchIcon className="w-5 h-5" />
            <span className="text-xs font-medium">Browse</span>
          </Link>
          <Link
            href="/browse?category=movie"
            className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <FilmIcon className="w-5 h-5" />
            <span className="text-xs font-medium">Movies</span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || pathname === item.path.split("?")[0];
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-cyan/10 text-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

// Icon components
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8M8 12h8" />
    </svg>
  );
}
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.5} />
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.5} />
    </svg>
  );
}
function SubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  );
}
function DubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}
function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  );
}
function FilmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" strokeWidth={1.5} />
      <line x1="7" y1="2" x2="7" y2="22" strokeWidth={1.5} />
      <line x1="17" y1="2" x2="17" y2="22" strokeWidth={1.5} />
      <line x1="2" y1="12" x2="22" y2="12" strokeWidth={1.5} />
      <line x1="2" y1="7" x2="7" y2="7" strokeWidth={1.5} />
      <line x1="2" y1="17" x2="7" y2="17" strokeWidth={1.5} />
      <line x1="17" y1="17" x2="22" y2="17" strokeWidth={1.5} />
      <line x1="17" y1="7" x2="22" y2="7" strokeWidth={1.5} />
    </svg>
  );
}
function TvIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth={1.5} />
      <line x1="8" y1="21" x2="16" y2="21" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="21" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <polygon points="10 8 16 12 10 16 10 8" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <polyline points="12 6 12 12 16 14" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35" />
    </svg>
  );
}
