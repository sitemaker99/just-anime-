"use client";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
import { SpotlightCarousel } from "@/components/blocks/spotlight-carousel";
import { AnimeCard } from "@/components/blocks/anime-card";
import { GenreBar } from "@/components/blocks/genre-bar";
import { TabbedAnimeSection } from "@/components/blocks/tabbed-anime-section";
import { TrendingSidebar } from "@/components/blocks/trending-sidebar";
import { TopTen } from "@/components/blocks/top-ten";
import { Spinner } from "@/components/ui/spinner";
import { useWatchProgress, type WatchProgress } from "@/hooks/use-watch-progress";
import { orpc } from "@/lib/query/orpc";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

function filterValidAnime<
  T extends { id: string | null; name: string | null; poster: string | null },
>(items: T[]): (T & { id: string; name: string; poster: string })[] {
  return items.filter(
    (item): item is T & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function ContinueWatchingRow({ items }: { items: WatchProgress[] }) {
  const valid = items.filter(
    (item): item is WatchProgress & { poster: string; name: string } =>
      !!item.poster && !!item.name,
  );
  if (valid.length === 0) return null;

  return (
    <section className="py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-sm font-semibold text-foreground">Continue Watching</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {valid.map((item) => {
            const progress = (item.currentTime / item.duration) * 100;
            return (
              <Link
                key={`${item.animeId}:${item.episodeNumber}`}
                href={`/watch/${item.animeId}/${item.episodeNumber}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-foreground/5">
                  <Image
                    src={item.poster}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-75"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm text-[10px] font-medium">
                    EP {item.episodeNumber}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <svg className="w-4 h-4 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
                    <div className="h-full bg-cyan transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors font-medium">
                  {item.name}
                </p>
                <p className="text-[10px] text-muted-foreground/50">
                  {formatTime(item.currentTime)} / {formatTime(item.duration)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  href?: string;
}
function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors flex items-center gap-1">
          View all
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

function AnimeGrid({ items, isLoading }: { items: ReturnType<typeof filterValidAnime>; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <AnimeCard
          key={item.id}
          id={item.id}
          name={item.name}
          poster={item.poster}
          type={"type" in item ? (item as { type?: string | null }).type : null}
          sub={"episodes" in item ? (item as { episodes?: { sub: number | null; dub: number | null } }).episodes?.sub : null}
          dub={"episodes" in item ? (item as { episodes?: { sub: number | null; dub: number | null } }).episodes?.dub : null}
          watchOnClick
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { getAllRecentlyWatched } = useWatchProgress();
  const recentlyWatched = getAllRecentlyWatched(6);

  const { data: homeData, isLoading } = useQuery(orpc.anime.getHomePage.queryOptions({}));

  const spotlightAnime = filterValidAnime(homeData?.spotlightAnimes ?? []);
  const trendingAnime = filterValidAnime(homeData?.trendingAnimes ?? []);
  const latestEpisodes = filterValidAnime(homeData?.latestEpisodeAnimes ?? []);
  const topAiring = filterValidAnime(homeData?.topAiringAnimes ?? []);
  const mostFavorite = filterValidAnime(homeData?.mostFavoriteAnimes ?? []);
  const latestCompleted = filterValidAnime(homeData?.latestCompletedAnimes ?? []);
  const genres: string[] = (homeData as { genres?: string[] } | undefined)?.genres ?? [];
  const topTen = (homeData as { top10Animes?: { today: unknown[]; week: unknown[]; month: unknown[] } } | undefined)?.top10Animes;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Spotlight */}
      <SpotlightCarousel anime={spotlightAnime} isLoading={isLoading} />

      {/* Genre bar */}
      {genres.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          <GenreBar genres={genres} />
        </div>
      )}

      {/* Continue Watching */}
      {recentlyWatched.length > 0 && <ContinueWatchingRow items={recentlyWatched} />}

      {/* Main content: left (latest episodes + tabbed) | right (trending + top 10) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
          {/* Left column */}
          <div className="space-y-10">
            {/* Latest Episodes */}
            <section>
              <SectionHeader title="Latest Episodes" href="/browse?category=recently-updated" />
              <AnimeGrid items={latestEpisodes} isLoading={isLoading} />
            </section>

            {/* Trending */}
            <section>
              <SectionHeader title="Trending" href="/browse?category=most-popular" />
              <AnimeGrid items={trendingAnime} isLoading={isLoading} />
            </section>

            {/* Tabbed: Top Airing / Most Favorite / Latest Completed */}
            {(topAiring.length > 0 || mostFavorite.length > 0 || latestCompleted.length > 0) && (
              <TabbedAnimeSection
                topAiring={topAiring}
                mostFavorite={mostFavorite}
                latestCompleted={latestCompleted}
                limit={10}
              />
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {trendingAnime.length > 0 && <TrendingSidebar trending={trendingAnime} />}
            {topTen && (
              <TopTen
                data={{
                  today: (topTen.today ?? []) as Parameters<typeof TopTen>[0]["data"]["today"],
                  week: (topTen.week ?? []) as Parameters<typeof TopTen>[0]["data"]["week"],
                  month: (topTen.month ?? []) as Parameters<typeof TopTen>[0]["data"]["month"],
                }}
              />
            )}

            {/* Top Airing quick list */}
            {topAiring.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Top Airing</h3>
                  <Link href="/browse?category=top-airing" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                    View all
                  </Link>
                </div>
                <div className="space-y-2">
                  {topAiring.slice(0, 5).map((item, i) => (
                    <Link key={item.id} href={`/anime/${item.id}`} className="flex items-center gap-3 group p-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="text-sm font-bold text-muted-foreground/40 w-5 text-center shrink-0">{i + 1}</span>
                      <div className="relative w-9 h-12 rounded overflow-hidden shrink-0 bg-foreground/5">
                        <Image src={item.poster} alt={item.name} fill className="object-cover" sizes="36px" />
                      </div>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug">{item.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
