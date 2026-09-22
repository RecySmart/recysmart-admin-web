import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-xs md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">{action}</div>}
    </div>
  );
}
