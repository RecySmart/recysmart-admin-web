import { z } from "zod";

export const SuccessResponseSchema = z.object({
  message: z.string(),
});
export const ErrorResponseSchema = z.object({
  message: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val] : val)),
  statusCode: z.number().optional(),
});

export const DraftLogInSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string("Password inválido")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const UserAPIResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LogInResponseSchema = z.object({
  user: UserAPIResponseSchema,
  token: z.string(),
});

export const StatusSchema = z.enum(["ONLINE", "OFFLINE"]);
export const CapacityStatusSchema = z.enum([
  "NORMAL",
  "WARNING",
  "NEEDS_PICKUP",
]);

export const DashboardBinMetricsSchema = z.object({
  active: z.number(),
  total: z.number(),
});

export const DashboardKpisSchema = z.object({
  totalPlasticKg: z.number(),
  co2AvoidedKg: z.number(),
  couponsRedeemed: z.number(),
  bins: DashboardBinMetricsSchema,
  plasticGrowthPercentage: z.number(),
});

export const IoTNetworkDeviceSchema = z.object({
  id: z.string(),
  location: z.string(),
  status: StatusSchema,
  capacityPercentage: z.number(),
  capacityStatus: CapacityStatusSchema,
  lastAiScanAt: z.string().nullable().optional(),
});

export const DashboardAPIResponseSchema = z.object({
  kpis: DashboardKpisSchema,
  iotNetwork: z.array(IoTNetworkDeviceSchema),
});

export type LogInFormData = z.infer<typeof DraftLogInSchema>;
export type User = z.infer<typeof UserAPIResponseSchema>;
export type DashboardResponse = z.infer<typeof DashboardAPIResponseSchema>;
export type IoTNetworkDevice = z.infer<typeof IoTNetworkDeviceSchema>;

export const CitizenWalletSchema = z.object({
  currentBalance: z.number(),
  lifetimePoints: z.number(),
  levelTitle: z.string(),
});

export const CitizenSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  wallet: CitizenWalletSchema.nullable().optional(),
});

export const CitizensResponseSchema = z.object({
  citizens: z.array(CitizenSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type CitizenWallet = z.infer<typeof CitizenWalletSchema>;
export type Citizen = z.infer<typeof CitizenSchema>;
export type CitizensResponse = z.infer<typeof CitizensResponseSchema>;

export const LevelResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  minPointsRequired: z.number(),
  userCount: z.number(),
});

export const LevelsResponseSchema = z.array(LevelResponseSchema);

export type Level = z.infer<typeof LevelResponseSchema>;
export type LevelsResponse = z.infer<typeof LevelsResponseSchema>;

export const PartnerStatsSchema = z.object({
  totalAllies: z.number(),
  activeRewards: z.number(),
  globalRedeems: z.number(),
});

export const PartnerSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  ruc: z.string(),
  logoUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
  activeRewardsCount: z.number(),
  totalCouponsRedeemed: z.number(),
  pointsReclaimed: z.number(),
});

export const PartnersDashboardResponseSchema = z.object({
  stats: PartnerStatsSchema,
  partners: z.array(PartnerSchema),
});

export type PartnerStats = z.infer<typeof PartnerStatsSchema>;
export type Partner = z.infer<typeof PartnerSchema>;
export type PartnersDashboardResponse = z.infer<
  typeof PartnersDashboardResponseSchema
>;

export const SmartBinStatusSchema = z.enum([
  "IDLE",
  "ACTIVE",
  "FULL",
  "MAINTENANCE",
]);

export const SmartBinSchema = z.object({
  id: z.string(),
  locationName: z.string(),
  maxCapacity: z.number(),
  currentCapacity: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  status: SmartBinStatusSchema,
});

export const CreateSmartBinSchema = z.object({
  locationName: z.string().min(1, "Location name cannot be empty"),
  maxCapacity: z.number().min(1, "Max capacity must be a positive number"),
  latitude: z.number(),
  longitude: z.number(),
});

export type SmartBinStatus = z.infer<typeof SmartBinStatusSchema>;
export type SmartBin = z.infer<typeof SmartBinSchema>;
export type CreateSmartBinData = z.infer<typeof CreateSmartBinSchema>;

export const SmartBinsResponseSchema = z.array(SmartBinSchema);
export type SmartBinsResponse = z.infer<typeof SmartBinsResponseSchema>;

export const RegisterAllySchema = z.object({
  name: z.string().min(1, "El nombre del administrador es requerido"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/\d/, "Debe contener al menos un número")
    .regex(/[^a-zA-Z\d]/, "Debe contener al menos un símbolo (ej. !@#$)"),
  companyName: z.string().min(1, "El nombre de la empresa es requerido"),
  ruc: z
    .string()
    .min(11, "El RUC debe tener exactamente 11 dígitos")
    .max(11, "El RUC debe tener exactamente 11 dígitos")
    .regex(/^\d+$/, "El RUC debe contener sólo números"),
  logoUrl: z
    .string()
    .url("URL de logotipo inválida")
    .optional()
    .or(z.literal("")),
});

export type RegisterAllyFormData = z.infer<typeof RegisterAllySchema>;
export type RegisterAllyRequest = RegisterAllyFormData & { requestId: string };

export const AiInferenceSchema = z.object({
  id: z.string(),
  attemptNumber: z.number(),
  status: z.string(),
  predictedClass: z.string().nullable(),
  confidence: z.number().nullable(),
  errorCode: z.string().nullable(),
  latencyMs: z.number().nullable(),
  analyzedAt: z.string().nullable(),
});

export const BottleDropSchema = z.object({
  id: z.string(),
  weightGrams: z.number().nullable(),
  aiConfidence: z.number().nullable(),
  photoUrl: z.string().nullable(),
  dropStatus: z.string(),
  createdAt: z.string(),
  inferences: z.array(AiInferenceSchema),
});

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  smartBinId: z.string(),
  smartBin: z.object({
    locationName: z.string(),
  }),
  status: z.string(),
  bottlesDeposited: z.number(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  drops: z.array(BottleDropSchema),
});

export const SessionsPaginatedResponseSchema = z.object({
  sessions: z.array(SessionSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type AiInference = z.infer<typeof AiInferenceSchema>;
export type BottleDrop = z.infer<typeof BottleDropSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type SessionsPaginatedResponse = z.infer<typeof SessionsPaginatedResponseSchema>;
