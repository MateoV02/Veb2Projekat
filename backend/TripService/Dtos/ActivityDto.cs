using System;
using TripService.Models;

namespace TripService.Dtos
{
    public class ActivityDto
    {
        public Guid Id { get; set; }

        public Guid TripPlanId { get; set; }

        public string Name { get; set; }

        public DateTime DateTime { get; set; }

        public string Location { get; set; }

        public string Description { get; set; }

        public decimal EstimatedCost { get; set; }

        public ActivityStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
