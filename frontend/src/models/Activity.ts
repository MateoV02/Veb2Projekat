export type ActivityStatus = "Planned" | "Reserved" | "Completed" | "Cancelled";

export interface Activity {
  id: string;
  tripPlanId: string;
  name: string;
  dateTime: string;
  location: string;
  description: string;
  estimatedCost: number;
  status: ActivityStatus;
  createdAt: string;
}

export interface ActivityRequest {
  name: string;
  dateTime: string;
  location: string;
  description: string;
  estimatedCost: number;
  status: ActivityStatus;
}

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  Planned: "Planirano",
  Reserved: "Rezervisano",
  Completed: "Završeno",
  Cancelled: "Otkazano",
};
