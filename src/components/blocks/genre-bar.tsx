"use client";

import { useRef } from "react";
import Link from "next/link";

interface GenreBarProps {
  genres: string[];
}

export function GenreBar({ genres }: GenreBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (!genres || genres.length === 0) return null;

  return (
    <div className="relative flex items-center gap-1 py-2">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded bg-foreground/10 hover:bg-foreground/20 transition-colors text-muted-foreground hover:text-foreground z-10"
        aria-label="Scroll genres left"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Left fade */}
      <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-[1] pointer-events-none" />

      {/* Scrollable genres */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-2 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/browse?category=most-popular&genre=${encodeURIComponent(genre)}`}
            className="shrink-0 px-3.5 py-1 rounded text-xs font-medium bg-foreground/8 hover:bg-foreground/15 text-muted-foreground hover:text-foreground transition-all duration-200 whitespace-nowrap border border-transparent hover:border-border"
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </Link>
        ))}
      </div>

      {/* Right fade */}
      <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-[1] pointer-events-none" />

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded bg-foreground/10 hover:bg-foreground/20 transition-colors text-muted-foreground hover:text-foreground z-10"
        aria-label="Scroll genres right"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
