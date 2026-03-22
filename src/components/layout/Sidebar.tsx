"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pin, X } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

const SIDEBAR_ANIMATION_MS = 400;

type SidebarProps = {
  open: boolean;
  pinned: boolean;
  onOpenChange: (open: boolean) => void;
  onPinnedChange: (pinned: boolean) => void;
  onNavigate: () => void;
};

type SidebarPanelProps = {
  pinned: boolean;
  onRequestClose: () => void;
  onPinnedChange: (pinned: boolean) => void;
  onNavigate: () => void;
};

function SidebarPanel({
  pinned,
  onRequestClose,
  onPinnedChange,
  onNavigate,
}: SidebarPanelProps) {
  const handleNavigate = () => {
    onNavigate();
    if (!pinned) {
      onRequestClose();
    }
  };

  return (
    <aside className="sidebar-shell flex h-full w-full flex-col px-4 py-4">
      <div
        className="flex items-center justify-between gap-3 border-b pb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="min-w-0">
          <Link
            href="/"
            onClick={handleNavigate}
            className="block text-[1.7rem] font-bold leading-none tracking-[-0.04em]"
            style={{ color: "var(--foreground)" }}
          >
            GSHS.app
          </Link>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            빠르게 원하는 페이지로 이동하세요.
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={onRequestClose}
            className={`inline-flex items-center justify-center overflow-hidden rounded-full border transition-[width,height,opacity,background-color,border-color,color] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${pinned ? "pointer-events-none h-0 w-0 opacity-0" : "h-10 w-10 opacity-100"}`}
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            aria-label="사이드바 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto pr-1">
        <SidebarNav pinned={pinned} onNavigate={handleNavigate} />
      </div>

      <div className="mt-4 flex justify-end border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={() => onPinnedChange(!pinned)}
          aria-label={pinned ? "사이드바 고정 해제" : "사이드바 고정"}
          title={pinned ? "고정 해제" : "고정"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
          style={{
            backgroundColor: pinned ? "var(--accent)" : "var(--surface-2)",
            borderColor: pinned ? "var(--accent)" : "var(--border)",
            color: pinned ? "var(--brand-sub)" : "var(--foreground)",
            boxShadow: pinned
              ? "0 12px 24px color-mix(in srgb, var(--accent) 22%, transparent)"
              : "none",
          }}
        >
          <Pin className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

export function Sidebar({
  open,
  pinned,
  onOpenChange,
  onPinnedChange,
  onNavigate,
}: SidebarProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [suppressOpenAnimation, setSuppressOpenAnimation] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const isVisible = open || isClosing;
  const overlayVisible = isVisible && !pinned;
  const drawerState = pinned
    ? "pinned"
    : isClosing
      ? "closed"
      : open
        ? suppressOpenAnimation
          ? "static-open"
          : "open"
        : "closed";

  useEffect(() => {
    if (open) {
      setIsClosing(false);
    }
  }, [open]);

  useEffect(() => {
    if (pinned) {
      setSuppressOpenAnimation(true);
      return;
    }

    if (!open) {
      setSuppressOpenAnimation(false);
    }
  }, [open, pinned]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const requestClose = () => {
    if (pinned || !open || isClosing) {
      return;
    }

    setIsClosing(true);

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false);
      onOpenChange(false);
      closeTimeoutRef.current = null;
    }, SIDEBAR_ANIMATION_MS);
  };

  useEffect(() => {
    if (!isVisible || pinned) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, pinned]);

  return (
    <>
      <div
        data-testid="desktop-sidebar-overlay"
        data-state={overlayVisible ? "open" : "closed"}
        onClick={requestClose}
        className={`desktop-sidebar-overlay fixed inset-0 z-[50] hidden bg-black/18 backdrop-blur-[2px] md:block ${overlayVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <div
        id="desktop-sidebar-drawer"
        data-testid="desktop-sidebar-drawer"
        data-state={drawerState}
        aria-label="데스크톱 사이드바"
        aria-hidden={!isVisible}
        className={`desktop-sidebar-drawer fixed inset-y-0 left-0 z-[70] hidden w-[18rem] transform-gpu border-r outline-none transition-[border-color,box-shadow,background-color] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:flex ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}
        style={{
          backgroundColor: "color-mix(in srgb, var(--surface) 96%, transparent)",
          borderColor: pinned
            ? "color-mix(in srgb, var(--accent) 28%, var(--border) 72%)"
            : "var(--border)",
          boxShadow: pinned
            ? "0 28px 80px color-mix(in srgb, var(--foreground) 12%, transparent)"
            : "0 28px 80px color-mix(in srgb, var(--foreground) 14%, transparent)",
        }}
      >
        <SidebarPanel
          pinned={pinned}
          onRequestClose={requestClose}
          onPinnedChange={onPinnedChange}
          onNavigate={onNavigate}
        />
      </div>
    </>
  );
}
