import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Session, BottleDrop } from "@/src/schemas";
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Box,
} from "lucide-react";

interface SessionsTableProps {
  sessions: Session[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SessionsTable({
  sessions,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: SessionsTableProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    null,
  );

  const toggleExpand = (sessionId: string) => {
    setExpandedSessionId((prev) => (prev === sessionId ? null : sessionId));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs animate-pulse">
        <div className="h-10 w-full rounded-lg bg-slate-100" />
        <div className="h-16 w-full rounded-lg bg-slate-50" />
        <div className="h-16 w-full rounded-lg bg-slate-50" />
        <div className="h-16 w-full rounded-lg bg-slate-50" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-500">
          <Box aria-hidden="true" className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            No se encontraron sesiones
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4">Punto de reciclaje</th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Inicio de Sesión</th>
              <th className="px-6 py-4 text-center">Botellas</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                isExpanded={expandedSessionId === session.id}
                onToggle={() => toggleExpand(session.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
        <p className="text-sm text-slate-500">
          Página <span className="font-bold text-slate-900">{page}</span> de{" "}
          <span className="font-bold text-slate-900">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionRow({
  session,
  isExpanded,
  onToggle,
}: {
  session: Session;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          label: "Completada",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          label: "En progreso",
        };
      case "EXPIRED":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          label: "Expirada",
        };
      default:
        return {
          bg: "bg-slate-100",
          border: "border-slate-200",
          text: "text-slate-700",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(session.status);

  return (
    <>
      <tr className="transition-colors hover:bg-slate-50/70">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm">
              <MapPin aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">
                {session.smartBin.locationName}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {session.smartBinId.slice(0, 8)}...
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 font-mono text-xs text-slate-500">
          {session.userId}
        </td>
        <td className="px-6 py-4">
          <p className="text-slate-800 font-medium">
            {format(new Date(session.startedAt), "dd/MM/yyyy HH:mm", {
              locale: es,
            })}
          </p>
        </td>
        <td className="px-6 py-4 text-center">
          <span className="font-bold text-slate-800 text-lg">
            {session.bottlesDeposited}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
          >
            {statusConfig.label}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <button
            onClick={onToggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            aria-label={isExpanded ? "Ocultar trazabilidad" : "Ver trazabilidad"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="bg-slate-50/50 p-6 border-b border-slate-100">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800">
                  Trazabilidad AiInference
                </h3>
              </div>

              {session.drops.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No se registraron depósitos en esta sesión.
                </p>
              ) : (
                <div className="space-y-4">
                  {session.drops.map((drop, index) => (
                    <DropTrace key={drop.id} drop={drop} index={index} />
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DropTrace({ drop, index }: { drop: BottleDrop; index: number }) {
  const isAccepted = drop.dropStatus === "ACCEPTED";
  const isError = drop.dropStatus === "AI_ERROR" || drop.dropStatus === "INVALID_REQUEST";
  const isRejected = !isAccepted && !isError;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-white px-4 py-3 gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
              isAccepted
                ? "bg-emerald-600"
                : isError
                ? "bg-red-600"
                : "bg-amber-500"
            }`}
          >
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Botella {index + 1}
            </p>
            <p className="text-xs text-slate-500 font-mono">ID: {drop.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {drop.photoUrl && (
            <a
              href={drop.photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100"
            >
              Ver foto
            </a>
          )}
          {drop.weightGrams && (
            <span className="text-xs font-medium text-slate-600">
              {drop.weightGrams}g
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              isAccepted
                ? "bg-emerald-100 text-emerald-700"
                : isError
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isAccepted && <CheckCircle2 className="h-3 w-3" />}
            {isError && <XCircle className="h-3 w-3" />}
            {isRejected && <AlertTriangle className="h-3 w-3" />}
            {drop.dropStatus}
          </span>
        </div>
      </div>
      <div className="p-4">
        {drop.inferences.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            Sin intentos de inferencia.
          </p>
        ) : (
          <div className="space-y-3">
            {drop.inferences.map((inf) => (
              <div
                key={inf.id}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md bg-white p-3 text-xs shadow-xs"
              >
                <div>
                  <span className="block font-medium text-slate-500 mb-0.5">
                    Clase predicha
                  </span>
                  <span className="font-bold text-slate-800">
                    {inf.predictedClass || "-"}
                  </span>
                </div>
                <div>
                  <span className="block font-medium text-slate-500 mb-0.5">
                    Confianza (IA)
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {inf.confidence !== null
                      ? `${(inf.confidence * 100).toFixed(1)}%`
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="block font-medium text-slate-500 mb-0.5">
                    Latencia
                  </span>
                  <span className="font-mono text-slate-800">
                    {inf.latencyMs ? `${inf.latencyMs}ms` : "-"}
                  </span>
                </div>
                <div>
                  <span className="block font-medium text-slate-500 mb-0.5">
                    Timestamp
                  </span>
                  <span className="text-slate-800 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {inf.analyzedAt
                      ? format(new Date(inf.analyzedAt), "HH:mm:ss.SSS")
                      : "-"}
                  </span>
                </div>
                {inf.errorCode && (
                  <div className="col-span-2 md:col-span-4 mt-2 rounded bg-red-50 p-2 text-red-700 font-mono text-xs">
                    Error: {inf.errorCode}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
