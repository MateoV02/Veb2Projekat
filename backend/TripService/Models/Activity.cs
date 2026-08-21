using System;

namespace TripService.Models
{
    public class Activity
    {
        public Guid Id { get; set; }

        public Guid TripPlanId { get; set; }

        public TripPlan TripPlan { get; set; }

        public string Name { get; set; }

        /// <summary>Datum i vreme aktivnosti (kombinovano u jednom polju).</summary>
        public DateTime DateTime { get; set; }

        public string Location { get; set; }

        public string Description { get; set; }

        public decimal EstimatedCost { get; set; }

        public ActivityStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
