import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import { useSession } from "next-auth/react";

export function useSessions(page = 1, limit = 10, search = "") {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["admin-sessions", page, limit, search, token],
    queryFn: () => {
      if (!token) throw new Error("No token found");
      return adminService.getSessions(token, page, limit, search);
    },
    enabled: !!token,
    staleTime: 5000,
  });
}
