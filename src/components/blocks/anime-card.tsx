"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AnimeCardProps {
  id: string;
  name: string;
  poster: string;
  type?: string | null;
  sub?: number | null;
  dub?: number | null;
  duration?: string | null;
  /** If true, clicking the card navigates to watch page instead of detail page */
  watchOnClick?: boolean;
}

export function AnimeCard({
  id,
  name,
  poster,
  type,
  sub,
  dub,
  duration,
  watchOnClick = false,
}: AnimeCardProps) {
  const router = useRouter();
  const href = watchOnClick ? `/watch/${id}/1` : `/anime/${id}`;

  return (
    <div className="group flex flex-col">
      <div
        className="relative w-full pb-[140%] overflow-hidden rounded-lg bg-foreground/5 cursor-pointer"
        onClick={() => router.push(href)}
      >
        <Image
          src={poster}
          alt={name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
          loading="lazy"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <svg className="w-5 h-5 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Bottom badges */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex flex-wrap items-center gap-1">
            {sub != null && (
              <span className="flex items-center gap-0.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                {sub}
              </span>
            )}
            {dub != null && (
              <span className="flex items-center gap-0.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {dub}
              </span>
            )}
            {type && (
              <span className="bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                {type.split(" ")[0]}
              </span>
            )}
            {duration && duration !== "m" && duration !== "?" && (
              <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded hidden sm:inline">
                {duration}
              </span>
            )}
          </div>
        </div>
      </div>

      <Link href={`/anime/${id}`} className="mt-2 text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors font-medium">
        {name}
      </Link>
    </div>
  );
}
