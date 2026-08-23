export interface ChecklistItem {
  id: string;
  tripPlanId: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface ChecklistItemRequest {
  text: string;
  isCompleted: boolean;
}
