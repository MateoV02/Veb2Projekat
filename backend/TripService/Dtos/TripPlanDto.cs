using System;

namespace TripService.Dtos
{
    public class TripPlanDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public decimal Budget { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
