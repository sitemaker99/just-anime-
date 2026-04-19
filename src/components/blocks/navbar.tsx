"use client";

import { useState } from "react";
import Link from "next/link";
import { CommandMenu } from "@/components/blocks/command-menu";
import { Sidebar } from "@/components/blocks/sidebar";
import { GitHubIcon, SearchIcon } from "@/components/ui/icons";
import { Kbd } from "@/components/ui/kbd";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSearch = () => {
    const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
    document.dispatchEvent(event);
  };

  return (
    <>
      <CommandMenu />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border pt-[env(safe-area-inset-top)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Open menu"
              >
                <MenuIcon className="w-5 h-5" />
              </button>

              <Link href="/" className="font-heading text-xl text-foreground">
                ani<span className="text-cyan">flix</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link href="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse</Link>
                <Link href="/schedule" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Schedule</Link>
                <Link href="/saved" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Saved</Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openSearch}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border text-sm text-muted-foreground transition-colors"
              >
                <SearchIcon className="w-4 h-4" />
                <span>Search...</span>
                <Kbd className="ml-2">⌘K</Kbd>
              </button>

              <button
                onClick={openSearch}
                className="sm:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5 text-muted-foreground" />
              </button>

              <a
                href="https://github.com/noelrohi/aniflix"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
