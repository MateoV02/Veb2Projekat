using System;

namespace TripService.Dtos
{
    public class ChecklistItemDto
    {
        public Guid Id { get; set; }

        public Guid TripPlanId { get; set; }

        public string Text { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
