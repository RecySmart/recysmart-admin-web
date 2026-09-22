"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { Menu, Leaf } from "lucide-react";

interface NavbarProps {
  onOpenMenu: () => void;
}

export function Navbar({ onOpenMenu }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 shadow-sm justify-between md:hidden z-30">
      {/* Mobile-only toggle and logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
          <Leaf className="text-white w-4.5 h-4.5" />
        </div>
        <span className="font-bold tracking-tight text-slate-800">
          RecySmart <span className="font-light text-slate-500">Admin</span>
        </span>
      </div>

      {/* Mobile-only user avatar */}
      <div>
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-200">
          JP
        </div>
      </div>
    </header>
  );
}
