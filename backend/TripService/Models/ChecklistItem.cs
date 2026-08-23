using System;

namespace TripService.Models
{
    public class ChecklistItem
    {
        public Guid Id { get; set; }

        public Guid TripPlanId { get; set; }

        public TripPlan TripPlan { get; set; }

        public string Text { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
