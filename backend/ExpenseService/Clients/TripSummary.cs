using System;

namespace ExpenseService.Clients
{
    public class TripSummary
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public decimal Budget { get; set; }
    }
}
