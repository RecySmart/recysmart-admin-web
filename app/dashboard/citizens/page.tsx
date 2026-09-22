"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useCitizens,
  useToggleCitizenStatus,
} from "@/src/hooks/useCitizens";
import { Citizen } from "@/src/schemas";
import { CitizensTable } from "@/components/dashboard/CitizensTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AlertTriangle, Search } from "lucide-react";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo actualizar el estado del ciudadano.";
}

export default function CitizensPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    citizen: Citizen | null;
  }>({ open: false, citizen: null });

  const { data, error, isLoading, isError } = useCitizens(page, limit, debouncedSearchQuery);
  const toggleStatus = useToggleCitizenStatus();

  const handleToggleClick = (citizen: Citizen) => {
    setConfirmDialog({ open: true, citizen });
  };

  const handleConfirmToggle = () => {
    if (!confirmDialog.citizen) return;

    const citizen = confirmDialog.citizen;
    const nextStatus = !citizen.isActive;

    toggleStatus.mutate(
      { citizenId: citizen.id, isActive: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            nextStatus
              ? "Cuenta de ciudadano reactivada."
              : "Cuenta de ciudadano suspendida.",
          );
          setConfirmDialog({ open: false, citizen: null });
        },
        onError: (mutationError) => {
          toast.error(getErrorMessage(mutationError));
          setConfirmDialog({ open: false, citizen: null });
        },
      },
    );
  };

  const handleNextPage = () => {
    if (data?.total && page * limit < data.total) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Directorio de ciudadanos"
        description="Consulta cuentas y administra su estado de acceso."
        action={
          <div className="relative w-full md:w-80">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-3 h-4 w-4 text-slate-400"
            />
            <label htmlFor="citizen-search" className="sr-only">
              Buscar ciudadanos
            </label>
            <input
              id="citizen-search"
              type="search"
              placeholder="Buscar por nombre, correo o UUID"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        }
      />

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              No se pudo cargar el directorio
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {getErrorMessage(error)}
            </p>
          </div>
        </div>
      )}

      {!isError && (
        <CitizensTable
          citizens={data?.citizens ?? []}
          isLoading={isLoading}
          total={data?.total}
          page={page}
          limit={limit}
          updatingCitizenId={
            toggleStatus.isPending
              ? toggleStatus.variables?.citizenId
              : undefined
          }
          onToggleStatus={handleToggleClick}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.citizen?.isActive
            ? "Suspender ciudadano"
            : "Reactivar ciudadano"
        }
        description={`¿Deseas ${
          confirmDialog.citizen?.isActive ? "suspender" : "reactivar"
        } la cuenta de ${confirmDialog.citizen?.name}? El cambio se aplicará inmediatamente.`}
        confirmText={
          confirmDialog.citizen?.isActive ? "Sí, suspender" : "Sí, reactivar"
        }
        cancelText="Cancelar"
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmDialog({ open: false, citizen: null })}
        isLoading={toggleStatus.isPending}
      />
    </div>
  );
}
