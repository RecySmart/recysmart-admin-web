"use client";

import React, { useState } from "react";
import { useDashboard } from "../../src/hooks/index";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/KpiCard";
import { IoTNetworkTable } from "@/components/dashboard/IoTNetworkTable";
import { RegisterBinDialog } from "@/components/dashboard/RegisterBinDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Recycle,
  Cloud,
  Ticket,
  Cpu,
  Search,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const { data, error, isLoading, isError } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBinOpen, setIsAddBinOpen] = useState(false);

  const filteredNetwork =
    data?.iotNetwork.filter((device) => {
      const query = searchQuery.toLowerCase();
      return (
        device.id.toLowerCase().includes(query) ||
        device.location.toLowerCase().includes(query)
      );
    }) || [];

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 sm:p-8 space-y-6">
        <PageHeader
          title="Resumen General"
          description="Métricas globales del ecosistema y estado de la red IoT."
          action={
            <div className="relative w-full md:w-80">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              />
              <label htmlFor="dashboard-search" className="sr-only">
                Buscar punto de reciclaje
              </label>
              <input
                id="dashboard-search"
                type="search"
                placeholder="Buscar por UUID o ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          }
        />

        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm font-medium animate-in fade-in duration-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Error al cargar métricas</p>
              <p className="opacity-90">
                {error instanceof Error ? error.message :
                  "No se pudo recuperar la información del panel."}
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </div>

            <IoTNetworkTable devices={[]} isLoading={true} />
          </>
        )}

        {!isLoading && !isError && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCard
                title="Plástico Reciclado"
                value={data.kpis.totalPlasticKg.toLocaleString()}
                unit="kg"
                icon={Recycle}
                iconBgClass="bg-emerald-50"
                iconColorClass="text-emerald-600"
              />

              <KpiCard
                title="CO₂ Evitado (estimado)"
                value={data.kpis.co2AvoidedKg.toLocaleString()}
                unit="kg"
                icon={Cloud}
                iconBgClass="bg-sky-50"
                iconColorClass="text-sky-600"
              />

              <KpiCard
                title="Cupones Canjeados"
                value={data.kpis.couponsRedeemed.toLocaleString()}
                icon={Ticket}
                iconBgClass="bg-purple-50"
                iconColorClass="text-purple-600"
              />

              <KpiCard
                title="Puntos Operativos"
                value={`${data.kpis.bins.active} / ${data.kpis.bins.total}`}
                icon={Cpu}
                iconBgClass="bg-blue-50"
                iconColorClass="text-blue-600"
              />
            </div>

            <IoTNetworkTable
              devices={filteredNetwork}
              isLoading={false}
              onAddBin={() => setIsAddBinOpen(true)}
            />
          </>
        )}
      </div>

      <RegisterBinDialog
        open={isAddBinOpen}
        onClose={() => setIsAddBinOpen(false)}
      />
    </main>
  );
}
