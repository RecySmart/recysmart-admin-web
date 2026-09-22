"use client";

import { useLevels } from "@/src/hooks/useLevels";
import { LevelsTable } from "@/components/dashboard/LevelsTable";
import { AlertTriangle, LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo recuperar la configuración de niveles.";
}
export default function GamificationRulesPage() {
  const { data, error, isLoading, isError } = useLevels();

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8">
      <PageHeader
        title="Niveles de gamificación"
        description="Consulta los umbrales vigentes y la distribución de ciudadanos."
        action={
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-600">
            <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            Configuración de solo lectura
          </span>
        }
      />

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              No se pudieron cargar los niveles
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {getErrorMessage(error)}
            </p>
          </div>
        </div>
      )}

      {!isError && (
        <LevelsTable levels={data ?? []} isLoading={isLoading} />
      )}
    </div>
  );
}
