"use client";

import Image from "next/image";
import Link from "next/link";

type TrendingItem = {
  id: string | null;
  name: string | null;
  poster: string | null;
  rank?: number | null;
  episodes?: { sub: number | null; dub: number | null } | null;
};

interface TrendingSidebarProps {
  trending: TrendingItem[];
}

export function TrendingSidebar({ trending }: TrendingSidebarProps) {
  const valid = trending.filter(
    (item): item is TrendingItem & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );

  if (valid.length === 0) return null;

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h2 className="text-sm font-semibold text-foreground">Trending Now</h2>
      </div>

      {/* List */}
      <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
        {valid.map((item, index) => (
          <Link
            key={item.id}
            href={`/anime/${item.id}`}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-foreground/5 transition-colors group"
          >
            {/* Rank */}
            <span
              className={`text-lg font-bold shrink-0 w-6 text-center leading-none mt-1 ${
                index < 3 ? "text-foreground" : "text-muted-foreground/40"
              }`}
            >
              {index + 1}
            </span>

            {/* Poster */}
            <div className="relative w-[42px] h-[58px] rounded overflow-hidden shrink-0 bg-foreground/5">
              <Image
                src={item.poster}
                alt={item.name}
                fill
                className="object-cover"
                sizes="42px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug">
                {item.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {item.episodes?.sub != null && (
                  <span className="text-[10px] bg-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    {item.episodes.sub}
                  </span>
                )}
                {item.episodes?.dub != null && (
                  <span className="text-[10px] bg-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {item.episodes.dub}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
