import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { adminService } from "../services/admin.service";

export const CITIZENS_KEY = "citizens";

export function useCitizens(page = 1, limit = 10, search = "") {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useQuery({
        queryKey: [CITIZENS_KEY, token, page, limit, search],
        queryFn: () => {
            return adminService.getCitizens(token!, page, limit, search);
        },
    enabled: !!token,
  });
}

interface ToggleCitizenStatusVariables {
  citizenId: string;
  isActive: boolean;
}

export function useToggleCitizenStatus() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: ({ citizenId, isActive }: ToggleCitizenStatusVariables) => {
      if (!token) {
        throw new Error("No se encontró una sesión administrativa activa.");
      }

      return adminService.toggleCitizenStatus(citizenId, isActive, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CITIZENS_KEY] });
    },
  });
}
