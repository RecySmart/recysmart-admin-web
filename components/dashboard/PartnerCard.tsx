import { Partner } from "@/src/schemas";
import { Store } from "lucide-react";

interface PartnerCardProps {
  partner: Partner;
}
export function PartnerCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex animate-pulse items-start gap-4 border-b border-slate-100 p-6">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-3 w-24 rounded bg-slate-100" />
          <div className="mt-2 h-5 w-20 rounded bg-slate-100" />
        </div>
      </div>
      <div className="flex-1 space-y-3 bg-slate-50/50 p-5">
        <div className="h-5 w-full rounded bg-slate-200" />
        <div className="h-5 w-full rounded bg-slate-200" />
        <div className="h-5 w-full rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs ${
        partner.isActive ? "" : "opacity-80"
      }`}
    >
      <div className="flex items-start gap-4 border-b border-slate-100 p-6">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border ${
            partner.isActive
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          <Store aria-hidden="true" className="h-8 w-8" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold leading-tight text-slate-800">
            {partner.companyName}
          </h2>
          <p className="mt-1 font-mono text-xs text-slate-500">
            RUC: {partner.ruc}
          </p>
          <span
            className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
              partner.isActive
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                partner.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {partner.isActive ? "Activo" : "Suspendido"}
          </span>
        </div>
      </div>

      <dl className="flex flex-1 flex-col justify-center bg-slate-50/50 p-5">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="text-xs font-semibold text-slate-500">
            Recompensas activas
          </dt>
          <dd className="rounded border border-slate-200 bg-white px-2 py-1 text-sm font-bold tabular-nums text-slate-800">
            {partner.activeRewardsCount.toLocaleString()}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3">
          <dt className="text-xs font-semibold text-slate-500">
            Cupones canjeados
          </dt>
          <dd className="text-sm font-bold tabular-nums text-green-700">
            {partner.totalCouponsRedeemed.toLocaleString()}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 pt-3">
          <dt className="text-xs font-semibold text-slate-500">
            EcoPuntos recuperados
          </dt>
          <dd className="text-sm font-bold tabular-nums text-slate-800">
            {partner.pointsReclaimed.toLocaleString()}
          </dd>
        </div>
      </dl>
    </article>
  );
}
