export type AccessType = "View" | "Edit";

export interface ShareLink {
  token: string;
  shareUrl: string;
  accessType: AccessType;
  qrCodeBase64: string;
  createdAt: string;
}

export interface TokenValidation {
  tripPlanId: string;
  accessType: AccessType;
}

export const ACCESS_TYPE_LABELS: Record<AccessType, string> = {
  View: "Samo pregled",
  Edit: "Pregled i izmena",
};
