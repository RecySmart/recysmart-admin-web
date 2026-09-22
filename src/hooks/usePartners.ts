import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { adminService } from "../services/admin.service";
import { RegisterAllyRequest } from "../schemas";

export const PARTNERS_KEY = "partners";

export function usePartners() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: [PARTNERS_KEY, token],
    queryFn: () => adminService.getPartnersDashboard(token!),
    enabled: !!token,
  });
}

export function useRegisterAlly() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (data: RegisterAllyRequest) => {
      if (!token) {
        throw new Error("No token provided");
      }
      return adminService.registerAlly(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PARTNERS_KEY, token] });
    },
  });
}
