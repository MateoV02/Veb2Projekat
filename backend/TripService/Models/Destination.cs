using System;

namespace TripService.Models
{
    public class Destination
    {
        public Guid Id { get; set; }

        public Guid TripPlanId { get; set; }

        public TripPlan TripPlan { get; set; }

        public string Name { get; set; }

        public string Location { get; set; }

        public DateTime ArrivalDate { get; set; }

        public DateTime DepartureDate { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
