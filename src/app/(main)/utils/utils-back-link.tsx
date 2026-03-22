"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type UtilsBackLinkProps = {
  href?: string;
  ariaLabel?: string;
};

export function UtilsBackLink({
  href = "/utils",
  ariaLabel = "도구 모음으로 돌아가기",
}: UtilsBackLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100/90 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
    >
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}
