"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimeCard } from "@/components/blocks/anime-card";

type AnimeItem = {
  id: string | null;
  name: string | null;
  poster: string | null;
  type?: string | null;
  episodes?: { sub: number | null; dub: number | null } | null;
  duration?: string | null;
};

interface TabbedAnimeSectionProps {
  topAiring: AnimeItem[];
  mostFavorite: AnimeItem[];
  latestCompleted: AnimeItem[];
  limit?: number;
}

const TABS = [
  { id: "airing", label: "Top Airing", path: "/browse?category=top-airing" },
  { id: "favorite", label: "Most Favorite", path: "/browse?category=most-favorite" },
  { id: "completed", label: "Latest Completed", path: "/browse?category=completed" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function filterValid(items: AnimeItem[]) {
  return items.filter(
    (item): item is AnimeItem & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );
}

export function TabbedAnimeSection({
  topAiring,
  mostFavorite,
  latestCompleted,
  limit = 10,
}: TabbedAnimeSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("airing");

  const dataMap: Record<TabId, AnimeItem[]> = {
    airing: topAiring,
    favorite: mostFavorite,
    completed: latestCompleted,
  };

  const currentData = filterValid(dataMap[activeTab]).slice(0, limit);
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="w-full">
      {/* Tab header */}
      <div className="flex items-center justify-between border-b border-border mb-4">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cyan after:rounded-t"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Link
          href={currentTab.path}
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors flex items-center gap-1 pr-1"
        >
          View all
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {currentData.map((item) => (
          <AnimeCard
            key={item.id}
            id={item.id!}
            name={item.name!}
            poster={item.poster!}
            type={item.type}
            sub={item.episodes?.sub}
            dub={item.episodes?.dub}
            duration={item.duration}
            watchOnClick
          />
        ))}
      </div>
    </div>
  );
}
