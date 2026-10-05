import { UseFormReturn } from "react-hook-form";
import { RegisterAllyFormData } from "@/src/schemas";

interface RegisterAllyFormProps {
  form: UseFormReturn<RegisterAllyFormData>;
  isLoading: boolean;
}

export function RegisterAllyForm({ form, isLoading }: RegisterAllyFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4 w-full text-left">
      
      {/* Admin Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-xs font-bold text-slate-500 block">
          Nombre del Administrador *
        </label>
        <input
          id="name"
          type="text"
          disabled={isLoading}
          placeholder="Ej: Jane Partner"
          {...register("name")}
          className={`w-full h-10 px-3 border rounded-lg bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
            errors.name ? "border-red-500" : "border-slate-200"
          }`}
        />
        {errors.name && (
          <p className="text-[10px] text-red-500 font-semibold">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Grid: Email & Password (1 column on mobile, 2 columns on tablet/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-slate-500 block">
            Correo Electrónico *
          </label>
          <input
            id="email"
            type="email"
            disabled={isLoading}
            placeholder="jane.partner@supermarket.com"
            {...register("email")}
            className={`w-full h-10 px-3 border rounded-lg bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
              errors.email ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 font-semibold">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-bold text-slate-500 block">
            Contraseña de Acceso *
          </label>
          <input
            id="password"
            type="password"
            disabled={isLoading}
            placeholder="••••••••"
            {...register("password")}
            className={`w-full h-10 px-3 border rounded-lg bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
              errors.password ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.password && (
            <p className="text-[10px] text-red-500 font-semibold">
              {errors.password.message}
            </p>
          )}
        </div>

      </div>

      {/* Grid: Company Name & RUC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Company Name */}
        <div className="space-y-1.5">
          <label htmlFor="companyName" className="text-xs font-bold text-slate-500 block">
            Nombre de la Empresa *
          </label>
          <input
            id="companyName"
            type="text"
            disabled={isLoading}
            placeholder="Ej: SuperEco Shop"
            {...register("companyName")}
            className={`w-full h-10 px-3 border rounded-lg bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
              errors.companyName ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.companyName && (
            <p className="text-[10px] text-red-500 font-semibold">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* RUC */}
        <div className="space-y-1.5">
          <label htmlFor="ruc" className="text-xs font-bold text-slate-500 block">
            Número de RUC *
          </label>
          <input
            id="ruc"
            type="text"
            inputMode="numeric"
            maxLength={11}
            pattern="[0-9]{11}"
            disabled={isLoading}
            placeholder="20123456789"
            {...register("ruc", {
              onChange: (event) => {
                event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
              },
            })}
            className={`w-full h-10 px-3 border rounded-lg bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
              errors.ruc ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.ruc && (
            <p className="text-[10px] text-red-500 font-semibold">
              {errors.ruc.message}
            </p>
          )}
        </div>

      </div>

      {/* Logo URL */}
      <div className="space-y-1.5">
        <label htmlFor="logoUrl" className="text-xs font-bold text-slate-500 block">
          URL del Logotipo (Opcional)
        </label>
        <input
          id="logoUrl"
          type="text"
          disabled={isLoading}
          placeholder="https://supereco.com/logo.png"
          {...register("logoUrl")}
          className={`w-full h-10 px-3 border rounded-lg bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
            errors.logoUrl ? "border-red-500" : "border-slate-200"
          }`}
        />
        {errors.logoUrl && (
          <p className="text-[10px] text-red-500 font-semibold">
            {errors.logoUrl.message}
          </p>
        )}
      </div>

    </div>
  );
}
