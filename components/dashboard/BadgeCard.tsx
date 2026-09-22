"use client";

import React from "react";
import { Satellite } from "lucide-react";

interface BadgeCardProps {
  emoji: string;
  title: string;
  description: string;
  emojiBgClass: string;
  emojiBorderClass: string;
  eventTrigger: string;
  ruleCode: string;
}

export function BadgeCard({
  emoji,
  title,
  description,
  emojiBgClass,
  emojiBorderClass,
  eventTrigger,
  ruleCode,
}: BadgeCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
      {/* Active Badge Status Banner */}
      <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider">
        ACTIVE
      </div>

      <div>
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-14 h-14 ${emojiBgClass} ${emojiBorderClass} rounded-2xl flex items-center justify-center text-2xl border shrink-0 shadow-inner`}
          >
            {emoji}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 leading-tight mb-1 text-sm sm:text-base truncate">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Rule Definition Box */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mt-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Listener Trigger
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-slate-200/50 px-2.5 py-1.5 rounded-lg border border-slate-200/30">
          <Satellite className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span>@Event(&apos;{eventTrigger}&apos;)</span>
        </div>
        <div className="mt-2 text-xs font-mono text-slate-600 bg-slate-900/5 p-2 rounded-lg border border-black/5">
          <span className="text-pink-600 font-semibold">if</span> {ruleCode}
        </div>
      </div>
    </div>
  );
}
