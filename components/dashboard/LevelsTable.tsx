import { Level } from "@/src/schemas";
import { Crown, Globe, Layers, Leaf, Sprout, Trees } from "lucide-react";

interface LevelsTableProps {
  levels: Level[];
  isLoading?: boolean;
}
export function LevelRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-3 w-16 rounded bg-slate-100" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 w-28 rounded bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 rounded bg-slate-200" />
      </td>
    </tr>
  );
}

export function LevelsTable({ levels, isLoading = false }: LevelsTableProps) {
  const getLevelStyling = (minPoints: number) => {
    if (minPoints >= 2500) {
      return {
        className: "border-blue-300 bg-blue-50 text-blue-700",
        icon: Globe,
      };
    }
    if (minPoints >= 1000) {
      return {
        className: "border-yellow-300 bg-yellow-50 text-yellow-700",
        icon: Crown,
      };
    }
    if (minPoints >= 500) {
      return {
        className: "border-emerald-300 bg-emerald-50 text-emerald-700",
        icon: Trees,
      };
    }
    if (minPoints >= 100) {
      return {
        className: "border-amber-300 bg-amber-50 text-amber-700",
        icon: Leaf,
      };
    }
    return {
      className: "border-slate-300 bg-slate-100 text-slate-600",
      icon: Sprout,
    };
  };

  return (
    <section aria-labelledby="levels-title">
      <div className="mb-6">
        <h2
          id="levels-title"
          className="flex items-center gap-2 text-lg font-bold text-slate-800"
        >
          <Layers aria-hidden="true" className="h-5 w-5 text-blue-600" />
          Mapa de progresión
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Los umbrales se muestran desde la configuración vigente del backend.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Nivel</th>
                <th className="px-6 py-4">EcoPuntos acumulados mínimos</th>
                <th className="px-6 py-4">Ciudadanos actuales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <>
                  <LevelRowSkeleton />
                  <LevelRowSkeleton />
                  <LevelRowSkeleton />
                </>
              ) : levels.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No existen niveles configurados.
                  </td>
                </tr>
              ) : (
                levels.map((level) => {
                  const styling = getLevelStyling(level.minPointsRequired);
                  const LevelIcon = styling.icon;

                  return (
                    <tr key={level.id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${styling.className}`}
                          >
                            <LevelIcon
                              aria-hidden="true"
                              className="h-5 w-5"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {level.name}
                            </p>
                            <p className="font-mono text-xs text-slate-500">
                              {level.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold tabular-nums text-slate-800">
                          {level.minPointsRequired.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          EcoPuntos
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold tabular-nums text-slate-700">
                          {level.userCount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
