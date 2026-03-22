"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { HomePersonalizationProvider } from "@/app/(main)/home-personalization";
import { cn } from "@/lib/utils";
import { DesktopUtilityHeader } from "./DesktopUtilityHeader";
import { Sidebar } from "./Sidebar";

type MainLayoutShellProps = {
  children: ReactNode;
  footer: ReactNode;
  homeWeather: ReactNode;
};

export function MainLayoutShell({ children, footer, homeWeather }: MainLayoutShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const [isDesktopSidebarPinned, setIsDesktopSidebarPinned] = useState(false);

  useEffect(() => {
    if (!isDesktopSidebarPinned) {
      setIsDesktopSidebarOpen(false);
    }
  }, [pathname]);

  const handlePinnedChange = (pinned: boolean) => {
    setIsDesktopSidebarPinned(pinned);
    setIsDesktopSidebarOpen(true);
  };
  const handleNavigate = () => {
    if (!isDesktopSidebarPinned) {
      setIsDesktopSidebarOpen(false);
    }
  };

  const content = (
    <>
      <Sidebar
        open={isDesktopSidebarOpen}
        pinned={isDesktopSidebarPinned}
        onOpenChange={setIsDesktopSidebarOpen}
        onPinnedChange={handlePinnedChange}
        onNavigate={handleNavigate}
      />

      <div
        className={cn(
          "hidden shrink-0 overflow-hidden transition-[width] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:block",
          isDesktopSidebarPinned ? "w-[18rem]" : "w-0",
        )}
      />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <DesktopUtilityHeader
          isHome={isHome}
          homeWeather={homeWeather}
          isSidebarOpen={isDesktopSidebarOpen}
          isSidebarPinned={isDesktopSidebarPinned}
          onSidebarToggle={() => {
            if (isDesktopSidebarPinned) {
              handlePinnedChange(false);
              return;
            }

            setIsDesktopSidebarOpen((open) => !open);
          }}
        />
        <div className="flex-1">
          {children}
        </div>
        {footer}
      </main>
    </>
  );

  const wrappedContent = (
    <div className="relative flex min-h-screen min-w-0 flex-1">
      {content}
    </div>
  );

  if (isHome) {
    return <HomePersonalizationProvider>{wrappedContent}</HomePersonalizationProvider>;
  }

  return wrappedContent;
}
