"use client";

import { SmartBin } from "@/src/schemas";
import {
  Activity,
  CirclePause,
  MapPin,
  PackageCheck,
  Wrench,
} from "lucide-react";

interface IoTDeviceCardProps {
  bin: SmartBin;
}
const STATUS_CONFIG = {
  IDLE: {
    label: "Disponible",
    description: "Disponible para iniciar una sesión.",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dotClassName: "bg-blue-500",
    icon: CirclePause,
  },
  ACTIVE: {
    label: "Sesión activa",
    description: "Existe una sesión de reciclaje en curso.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClassName: "bg-emerald-500",
    icon: Activity,
  },
  FULL: {
    label: "Lleno",
    description: "Alcanzó la capacidad máxima configurada.",
    className: "border-red-200 bg-red-50 text-red-700",
    dotClassName: "bg-red-500",
    icon: PackageCheck,
  },
  MAINTENANCE: {
    label: "Mantenimiento",
    description: "El punto no está disponible para nuevas sesiones.",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    dotClassName: "bg-amber-500",
    icon: Wrench,
  },
} as const;

export function IoTDeviceCard({ bin }: IoTDeviceCardProps) {
  const capacityPercentage =
    bin.maxCapacity > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((bin.currentCapacity / bin.maxCapacity) * 100)),
        )
      : 0;
  const status = STATUS_CONFIG[bin.status];
  const StatusIcon = status.icon;

  const progressClassName =
    capacityPercentage >= 90
      ? "bg-red-500"
      : capacityPercentage >= 75
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Punto de reciclaje
          </p>
          <h2 className="mt-1 truncate text-base font-bold text-slate-800">
            {bin.locationName}
          </h2>
          <p className="mt-1 truncate font-mono text-xs text-slate-500">
            {bin.id}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${status.className}`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
          />
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-slate-600">
              Ocupación estimada
            </span>
            <span className="font-bold tabular-nums text-slate-800">
              {capacityPercentage}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Ocupación estimada por botellas aceptadas"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={capacityPercentage}
            className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className={`h-full rounded-full ${progressClassName}`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs text-slate-500">
            {bin.currentCapacity.toLocaleString()} de{" "}
            {bin.maxCapacity.toLocaleString()} botellas
          </p>
        </div>

        <div className={`rounded-xl border p-4 ${status.className}`}>
          <div className="flex items-start gap-3">
            <StatusIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-bold">{status.label}</p>
              <p className="mt-1 text-xs leading-relaxed">
                {status.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="tabular-nums">
            {bin.latitude.toFixed(6)}, {bin.longitude.toFixed(6)}
          </span>
        </div>
      </div>
    </article>
  );
}
