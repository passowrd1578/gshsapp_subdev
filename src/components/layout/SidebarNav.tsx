"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mainNavItems } from "@/config/nav";
import { cn } from "@/lib/utils";
import { NotificationBadge } from "./notification-badge";

const SIDEBAR_CLOSE_ANIMATION_MS = 400;

export function SidebarNav({
  pinned,
  onNavigate,
}: {
  pinned: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const navigationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pinned) {
      onNavigate?.();
      return;
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onNavigate?.();

    if (navigationTimeoutRef.current !== null) {
      window.clearTimeout(navigationTimeoutRef.current);
    }

    if (href === pathname) {
      return;
    }

    navigationTimeoutRef.current = window.setTimeout(() => {
      router.push(href);
      navigationTimeoutRef.current = null;
    }, SIDEBAR_CLOSE_ANIMATION_MS);
  };

  return (
    <nav className="sidebar-nav flex w-full flex-col gap-1.5">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={isActive ? "true" : "false"}
            onClick={(event) => handleClick(event, item.href)}
            className={cn(
              "sidebar-nav-link flex w-full min-h-11 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
              isActive
                ? "border-[color:var(--accent)] bg-[color:var(--surface-2)] text-[color:var(--foreground)]"
                : "border-transparent bg-transparent text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]",
            )}
          >
            <div className="relative">
              <item.icon
                className={cn(
                  "sidebar-nav-icon h-5 w-5 transition-colors duration-300",
                  isActive ? "text-[color:var(--accent)]" : "text-[color:var(--muted)]",
                )}
              />
              {item.href === "/notifications" ? (
                <NotificationBadge className="-right-1 -top-1" />
              ) : null}
            </div>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
