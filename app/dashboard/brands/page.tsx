"use client";

import { useState } from "react";
import { usePartners } from "@/src/hooks/usePartners";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/KpiCard";
import {
  PartnerCard,
  PartnerCardSkeleton,
} from "@/components/dashboard/PartnerCard";
import { RegisterAllyDialog } from "./_components/RegisterAllyDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  AlertTriangle,
  Building2,
  Filter,
  Gift,
  Plus,
  Search,
  Ticket,
} from "lucide-react";

type StatusFilter = "ALL" | "ACTIVE" | "SUSPENDED";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo recuperar la información de aliados.";
}
export default function PartnerBrandsPage() {
  const { data, error, isLoading, isError } = usePartners();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const filteredPartners =
    data?.partners.filter((partner) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        partner.companyName.toLowerCase().includes(query) ||
        partner.ruc.toLowerCase().includes(query) ||
        partner.id.toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (statusFilter === "ACTIVE") return partner.isActive;
      if (statusFilter === "SUSPENDED") return !partner.isActive;
      return true;
    }) ?? [];

  const activePartners =
    data?.partners.filter((partner) => partner.isActive).length ?? 0;
  const suspendedPartners = (data?.partners.length ?? 0) - activePartners;

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Empresas aliadas"
        description="Consulta métricas reales y registra nuevas empresas en RecySmart."
        action={
          <>
            <div className="relative min-w-0 flex-1 lg:w-72">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              />
              <label htmlFor="partner-search" className="sr-only">
                Buscar empresas aliadas
              </label>
              <input
                id="partner-search"
                type="search"
                placeholder="Buscar por nombre, RUC o UUID"
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
              Registrar aliado
            </button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
        {isError && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">
                No se pudo cargar la información de aliados
              </p>
              <p className="mt-1">{getErrorMessage(error)}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <PartnerCardSkeleton />
              <PartnerCardSkeleton />
              <PartnerCardSkeleton />
            </div>
          </>
        )}

        {!isLoading && !isError && data && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <KpiCard
                title="Aliados registrados"
                value={data.stats.totalAllies}
                icon={Building2}
                iconBgClass="bg-blue-50"
                iconColorClass="text-blue-600"
              />
              <KpiCard
                title="Recompensas activas"
                value={data.stats.activeRewards}
                icon={Gift}
                iconBgClass="bg-purple-50"
                iconColorClass="text-purple-600"
              />
              <KpiCard
                title="Cupones canjeados"
                value={data.stats.globalRedeems}
                icon={Ticket}
                iconBgClass="bg-emerald-50"
                iconColorClass="text-emerald-600"
              />
            </div>

            <div
              className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200/60 pb-4"
              aria-label="Filtrar aliados por estado"
            >
              <button
                type="button"
                aria-pressed={statusFilter === "ALL"}
                onClick={() => setStatusFilter("ALL")}
                className={`min-h-10 rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
                  statusFilter === "ALL"
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Todos ({data.partners.length})
              </button>
              <button
                type="button"
                aria-pressed={statusFilter === "ACTIVE"}
                onClick={() => setStatusFilter("ACTIVE")}
                className={`min-h-10 rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
                  statusFilter === "ACTIVE"
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                Activos ({activePartners})
              </button>
              <button
                type="button"
                aria-pressed={statusFilter === "SUSPENDED"}
                onClick={() => setStatusFilter("SUSPENDED")}
                className={`min-h-10 rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
                  statusFilter === "SUSPENDED"
                    ? "border-red-700 bg-red-700 text-white"
                    : "border-slate-200 bg-white text-red-700 hover:bg-red-50"
                }`}
              >
                Suspendidos ({suspendedPartners})
              </button>
            </div>

            {filteredPartners.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-500">
                  <Filter aria-hidden="true" className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    No se encontraron aliados
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ajusta la búsqueda o selecciona otro estado.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <RegisterAllyDialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </main>
  );
}
