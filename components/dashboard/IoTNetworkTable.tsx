import { IoTNetworkDevice } from "../../src/schemas";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface IoTNetworkTableProps {
  devices: IoTNetworkDevice[];
  isLoading?: boolean;
  onAddBin?: () => void;
}
export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
        <div className="h-3 w-48 rounded bg-slate-100" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-32 rounded-full bg-slate-200" />
      </td>
      <td className="min-w-37.5 px-6 py-4 sm:w-64">
        <div className="mb-1.5 flex justify-between">
          <div className="h-3 w-8 rounded bg-slate-200" />
          <div className="h-3 w-12 rounded bg-slate-200" />
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 rounded bg-slate-200" />
      </td>
    </tr>
  );
}

export function IoTNetworkTable({
  devices,
  isLoading = false,
  onAddBin,
}: IoTNetworkTableProps) {
  const formatLastDeposit = (dateString?: string | null) => {
    if (!dateString) return "Sin depósitos registrados";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Sin depósitos registrados";

    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getCapacityStyling = (percentage: number, status: string) => {
    if (status === "NEEDS_PICKUP" || percentage >= 90) {
      return {
        barColor: "bg-red-500",
        textColor: "text-red-700 font-bold",
        label: "Requiere atención",
      };
    }
    if (status === "WARNING" || percentage >= 75) {
      return {
        barColor: "bg-amber-500",
        textColor: "text-amber-700 font-bold",
        label: "Capacidad alta",
      };
    }
    return {
      barColor: "bg-green-500",
      textColor: "text-slate-600",
      label: "Normal",
    };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Puntos de reciclaje
          </h2>
          <p className="text-sm text-slate-500">
            Estado administrativo y ocupación estimada registrada.
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddBin}
          className="h-10 w-full bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 sm:w-auto"
        >
          <Plus aria-hidden="true" className="mr-1 h-4 w-4 shrink-0" />
          Registrar punto
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-175 border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4 font-bold">Punto / ubicación</th>
              <th className="px-6 py-4 font-bold">Estado administrativo</th>
              <th className="px-6 py-4 font-bold">Ocupación estimada</th>
              <th className="px-6 py-4 font-bold">Último depósito</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : devices.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No se encontraron puntos de reciclaje.
                </td>
              </tr>
            ) : (
              devices.map((device) => {
                const isAvailable = device.status === "ONLINE";
                const capacityStyle = getCapacityStyling(
                  device.capacityPercentage,
                  device.capacityStatus,
                );

                return (
                  <tr
                    key={device.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{device.id}</p>
                      <p className="text-xs text-slate-500">
                        {device.location}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
                          isAvailable
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${
                            isAvailable ? "bg-green-500" : "bg-amber-500"
                          }`}
                        />
                        {isAvailable
                          ? "Fuera de mantenimiento"
                          : "Mantenimiento"}
                      </span>
                    </td>
                    <td className="min-w-37.5 px-6 py-4 sm:w-64">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className={capacityStyle.textColor}>
                          {device.capacityPercentage}%
                        </span>
                        <span className={capacityStyle.textColor}>
                          {capacityStyle.label}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Ocupación estimada de ${device.location}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={device.capacityPercentage}
                        className="h-2 w-full rounded-full bg-slate-100"
                      >
                        <div
                          className={`h-2 rounded-full ${capacityStyle.barColor}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, device.capacityPercentage))}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                    {formatLastDeposit(device.lastAiScanAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
