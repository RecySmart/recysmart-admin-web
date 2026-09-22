import { apiFetch } from "../lib/api";
import {
  CitizensResponseSchema,
  DashboardAPIResponseSchema,
  LevelsResponseSchema,
  PartnersDashboardResponseSchema,
  SmartBinsResponseSchema,
  SmartBinSchema,
  CreateSmartBinData,
  RegisterAllyRequest,
  UserAPIResponseSchema,
  SessionsPaginatedResponseSchema,
} from "../schemas";

export const adminService = {
  getDashboardData: async (token: string) => {
    const res = await apiFetch(
      "/admin/dashboard/summary",
      {
        method: "GET",
      },
      token,
    );

    return DashboardAPIResponseSchema.parse(res);
  },

  getCitizens: async (token: string, page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);

    const res = await apiFetch(
      `/admin/citizens?${params.toString()}`,
      {
        method: "GET",
      },
      token,
    );

    return CitizensResponseSchema.parse(res);
  },

  toggleCitizenStatus: async (
    citizenId: string,
    isActive: boolean,
    token: string,
  ) => {
    const res = await apiFetch(
      `/admin/citizens/${citizenId}/toggle-status`,
      {
        method: "POST",
        body: JSON.stringify({ isActive }),
        headers: {
          "Content-Type": "application/json",
        },
      },
      token,
    );

    return UserAPIResponseSchema.parse(res);
  },

  getLevels: async (token: string) => {
    const res = await apiFetch(
      "/levels/stats",
      {
        method: "GET",
      },
      token,
    );
    console.log(res);

    return LevelsResponseSchema.parse(res);
  },

  getPartnersDashboard: async (token: string) => {
    const res = await apiFetch(
      "/admin/partners/dashboard",
      {
        method: "GET",
      },
      token,
    );

    return PartnersDashboardResponseSchema.parse(res);
  },

  getBins: async (token: string) => {
    const res = await apiFetch(
      "/admin/bins",
      {
        method: "GET",
      },
      token,
    );

    return SmartBinsResponseSchema.parse(res);
  },

  registerBin: async (binData: CreateSmartBinData, token: string) => {
    const res = await apiFetch(
      "/admin/bins/register",
      {
        method: "POST",
        body: JSON.stringify(binData),
        headers: {
          "Content-Type": "application/json",
        },
      },
      token,
    );

    return SmartBinSchema.parse(res);
  },

  registerAlly: async (allyData: RegisterAllyRequest, token: string) => {
    const payload = {
      ...allyData,
      logoUrl: allyData.logoUrl ? allyData.logoUrl : undefined,
    };
    const res = await apiFetch(
      "/auth/register/ally",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      },
      token,
    );
    return res;
  },

  getSessions: async (token: string, page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);

    const res = await apiFetch(
      `/admin/sessions?${params.toString()}`,
      {
        method: "GET",
      },
      token,
    );

    return SessionsPaginatedResponseSchema.parse(res);
  },
};
