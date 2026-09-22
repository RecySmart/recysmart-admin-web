"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessions } from "@/src/hooks/useSessions";
import { SessionsTable } from "@/components/dashboard/SessionsTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { AlertTriangle, Search } from "lucide-react";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo recuperar el historial de sesiones.";
}

function SessionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params for SSR-friendly state
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
  const searchParam = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);

    const newUrl = params.toString() ? `?${params.toString()}` : "/dashboard/sessions";
    router.replace(newUrl, { scroll: false });
  }, [page, debouncedSearch, router]);

  const { data, error, isLoading, isError } = useSessions(
    page,
    10,
    debouncedSearch,
  );

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Sesiones de reciclaje"
        description="Audita el historial de sesiones y la trazabilidad de AiInference (YOLOv8)."
        action={
          <div className="relative min-w-0 flex-1 lg:w-72">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
            />
            <label htmlFor="session-search" className="sr-only">
              Buscar sesiones
            </label>
            <input
              id="session-search"
              type="search"
              placeholder="Buscar por UUID o punto..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
        {isError && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Error al cargar las sesiones</p>
              <p className="mt-1">{getErrorMessage(error)}</p>
            </div>
          </div>
        )}

        <SessionsTable
          sessions={data?.sessions ?? []}
          isLoading={isLoading}
          page={page}
          totalPages={data?.meta.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}

export default function SessionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando...</div>}>
      <SessionsPageContent />
    </Suspense>
  );
}
