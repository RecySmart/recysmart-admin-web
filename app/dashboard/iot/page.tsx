"use client";

import { useMemo, useState } from "react";
import { useBins } from "@/src/hooks/useBins";
import { SmartBinStatus } from "@/src/schemas";
import { IoTDeviceCard } from "@/components/dashboard/IoTDeviceCard";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/KpiCard";
import { RegisterBinDialog } from "@/components/dashboard/RegisterBinDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Activity,
  AlertTriangle,
  Cpu,
  PackageCheck,
  Plus,
  Search,
  Wrench,
} from "lucide-react";

type StatusFilter = "ALL" | SmartBinStatus;

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "Todos" },
  { value: "IDLE", label: "Disponibles" },
  { value: "ACTIVE", label: "En sesión" },
  { value: "FULL", label: "Llenos" },
  { value: "MAINTENANCE", label: "Mantenimiento" },
];

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudieron recuperar los puntos de reciclaje.";
}

export default function IoTNetworkPage() {
  const { data, error, isLoading, isError } = useBins();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const counts = useMemo(() => {
    const bins = data ?? [];

    return {
      total: bins.length,
      idle: bins.filter((bin) => bin.status === "IDLE").length,
      active: bins.filter((bin) => bin.status === "ACTIVE").length,
      full: bins.filter((bin) => bin.status === "FULL").length,
      maintenance: bins.filter((bin) => bin.status === "MAINTENANCE").length,
    };
  }, [data]);

  const filteredBins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (data ?? []).filter((bin) => {
      const matchesStatus =
        statusFilter === "ALL" || bin.status === statusFilter;
      const matchesSearch =
        query.length === 0 ||
        bin.id.toLowerCase().includes(query) ||
        bin.locationName.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [data, searchQuery, statusFilter]);

  const getFilterCount = (filter: StatusFilter) => {
    switch (filter) {
      case "IDLE":
        return counts.idle;
      case "ACTIVE":
        return counts.active;
      case "FULL":
        return counts.full;
      case "MAINTENANCE":
        return counts.maintenance;
      default:
        return counts.total;
    }
  };

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Puntos de reciclaje"
        description="Consulta el estado operativo y la ocupación estimada por botellas."
        action={
          <>
            <div className="relative min-w-0 flex-1 lg:w-72">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              />
              <label htmlFor="bin-search" className="sr-only">
                Buscar puntos de reciclaje
              </label>
              <input
                id="bin-search"
                type="search"
                placeholder="Buscar por ubicación o UUID"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-xs transition-colors hover:bg-emerald-700"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Registrar punto
            </button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-8">
        {isError && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">
                No se pudieron cargar los puntos de reciclaje
              </p>
              <p className="mt-1">{getErrorMessage(error)}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Puntos registrados"
                value={counts.total}
                icon={Cpu}
                iconBgClass="bg-blue-50"
                iconColorClass="text-blue-600"
              />
              <KpiCard
                title="Sesiones activas"
                value={counts.active}
                icon={Activity}
                iconBgClass="bg-emerald-50"
                iconColorClass="text-emerald-600"
              />
              <KpiCard
                title="Puntos llenos"
                value={counts.full}
                icon={PackageCheck}
                iconBgClass="bg-red-50"
                iconColorClass="text-red-600"
              />
              <KpiCard
                title="En mantenimiento"
                value={counts.maintenance}
                icon={Wrench}
                iconBgClass="bg-amber-50"
                iconColorClass="text-amber-700"
              />
            </div>

            <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar por estado">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={statusFilter === filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`min-h-10 rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
                    statusFilter === filter.value
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {filter.label} ({getFilterCount(filter.value)})
                </button>
              ))}
            </div>

            {filteredBins.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <h2 className="text-lg font-bold text-slate-800">
                  No se encontraron puntos
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Ajusta la búsqueda o selecciona otro estado operativo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredBins.map((bin) => (
                  <IoTDeviceCard key={bin.id} bin={bin} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <RegisterBinDialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </main>
  );
}
