"use client";

import { Citizen } from "@/src/schemas";
import {
  Ban,
  Coins,
  Crown,
  Globe,
  Leaf,
  Loader2,
  Sprout,
  Trees,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CitizensTableProps {
  citizens: Citizen[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  updatingCitizenId?: string;
  onToggleStatus: (citizen: Citizen) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}
export function CitizenRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-100" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="mb-2 h-4 w-16 rounded bg-slate-200" />
        <div className="h-3 w-20 rounded bg-slate-100" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-24 rounded bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="ml-auto h-8 w-8 rounded bg-slate-200" />
      </td>
    </tr>
  );
}

export function CitizensTable({
  citizens,
  isLoading = false,
  total,
  page = 1,
  limit = 10,
  updatingCitizenId,
  onToggleStatus,
  onNextPage,
  onPrevPage,
}: CitizensTableProps) {
  const getLevelStyling = (levelTitle: string = "Eco Beginner") => {
    const title = levelTitle.toLowerCase();

    if (title.includes("guardian")) {
      return {
        className: "border-blue-200 bg-blue-50 text-blue-700",
        icon: Globe,
      };
    }
    if (title.includes("master")) {
      return {
        className: "border-yellow-200 bg-yellow-50 text-yellow-700",
        icon: Crown,
      };
    }
    if (title.includes("warrior")) {
      return {
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: Trees,
      };
    }
    if (title.includes("apprentice")) {
      return {
        className: "border-amber-200 bg-amber-50 text-amber-700",
        icon: Leaf,
      };
    }

    return {
      className: "border-slate-200 bg-slate-100 text-slate-600",
      icon: Sprout,
    };
  };

  const startRecord = (page - 1) * limit + (citizens.length > 0 ? 1 : 0);
  const endRecord = (page - 1) * limit + citizens.length;
  const totalRecords = total ?? citizens.length;
  const hasNextPage = totalRecords > page * limit;
  const hasPrevPage = page > 1;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-sm font-bold text-slate-800">
          Usuarios registrados (
          <span className="text-blue-600">{totalRecords}</span>)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4">Ciudadano</th>
              <th className="px-6 py-4">EcoPuntos</th>
              <th className="px-6 py-4">Nivel</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <>
                <CitizenRowSkeleton />
                <CitizenRowSkeleton />
                <CitizenRowSkeleton />
              </>
            ) : citizens.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No se encontraron ciudadanos.
                </td>
              </tr>
            ) : (
              citizens.map((citizen) => {
                const levelStyling = getLevelStyling(
                  citizen.wallet?.levelTitle,
                );
                const LevelIcon = levelStyling.icon;
                const isUpdating = updatingCitizenId === citizen.id;

                return (
                  <tr
                    key={citizen.id}
                    className={
                      citizen.isActive
                        ? "transition-colors hover:bg-slate-50/70"
                        : "bg-red-50/30 transition-colors hover:bg-red-50/50"
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 font-bold text-blue-700">
                          {citizen.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-800">
                            {citizen.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {citizen.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Coins
                          aria-hidden="true"
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="font-bold text-slate-700">
                          {citizen.wallet?.currentBalance.toLocaleString() ??
                            "0"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Acumulados:{" "}
                        {citizen.wallet?.lifetimePoints.toLocaleString() ?? "0"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-bold ${levelStyling.className}`}
                      >
                        <LevelIcon aria-hidden="true" className="h-3 w-3" />
                        {citizen.wallet?.levelTitle ?? "Eco Beginner"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
                          citizen.isActive
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${
                            citizen.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {citizen.isActive ? "Activo" : "Suspendido"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(citizen)}
                        disabled={isUpdating}
                        aria-label={
                          citizen.isActive
                            ? `Suspender a ${citizen.name}`
                            : `Reactivar a ${citizen.name}`
                        }
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors disabled:cursor-wait disabled:opacity-50 ${
                          citizen.isActive
                            ? "text-slate-500 hover:bg-red-50 hover:text-red-700"
                            : "text-slate-500 hover:bg-green-50 hover:text-green-700"
                        }`}
                        title={citizen.isActive ? "Suspender" : "Reactivar"}
                      >
                        {isUpdating ? (
                          <Loader2
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin"
                          />
                        ) : citizen.isActive ? (
                          <Ban aria-hidden="true" className="h-4 w-4" />
                        ) : (
                          <Unlock aria-hidden="true" className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <div>
            Mostrando <strong className="text-slate-800">{startRecord}</strong>{" "}
            a <strong className="text-slate-800">{endRecord}</strong> de{" "}
            <strong className="text-slate-800">{totalRecords}</strong> ciudadanos.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevPage}
              disabled={!hasPrevPage}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
