"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItemType {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavItemProps {
  item: NavItemType;
  collapsed: boolean;
  onClick?: () => void;
}

export function NavItem({ item, collapsed, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.name : undefined}
      onClick={onClick}
      className={`flex items-center rounded-lg font-medium transition-colors text-sm ${
        collapsed ? "justify-center p-3" : "px-3 py-2"
      } ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon className={`w-5 h-5 shrink-0 transition-all ${collapsed ? "mr-0" : "mr-3"}`} />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );
}
