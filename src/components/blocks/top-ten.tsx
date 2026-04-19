"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TopItem = {
  id: string | null;
  name: string | null;
  poster: string | null;
  episodes?: { sub: number | null; dub: number | null } | null;
};

type TopTenData = {
  today: TopItem[];
  week: TopItem[];
  month: TopItem[];
};

interface TopTenProps {
  data: TopTenData;
}

type Period = "today" | "week" | "month";

export function TopTen({ data }: TopTenProps) {
  const [period, setPeriod] = useState<Period>("today");
  const router = useRouter();

  const currentData = (data[period] ?? []).filter(
    (item): item is TopItem & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Top 10</h2>
        <div className="flex bg-foreground/5 rounded-lg overflow-hidden border border-border">
          {(["today", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium transition-colors capitalize ${
                period === p
                  ? "bg-foreground/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {currentData.slice(0, 10).map((item, index) => (
          <div key={item.id} className="flex items-center gap-3 group">
            {/* Rank number */}
            <span
              className={`text-xl font-bold shrink-0 w-7 text-right ${
                index < 3 ? "text-foreground border-b-2 border-foreground pb-0.5" : "text-muted-foreground/30"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Card row */}
            <div className="flex-1 flex items-center gap-2 p-1.5 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer"
              onClick={() => router.push(`/watch/${item.id}/1`)}
            >
              <div className="relative w-[44px] h-[58px] rounded overflow-hidden shrink-0 bg-foreground/5">
                <Image
                  src={item.poster}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="44px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/anime/${item.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-1 mt-1">
                  {item.episodes?.sub != null && (
                    <span className="text-[10px] bg-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded">
                      SUB {item.episodes.sub}
                    </span>
                  )}
                  {item.episodes?.dub != null && (
                    <span className="text-[10px] bg-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded">
                      DUB {item.episodes.dub}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
