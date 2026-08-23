using System;
using ExpenseService.Models;

namespace ExpenseService.Dtos
{
    public class ExpenseDto
    {
        public Guid Id { get; set; }

        public Guid TripPlanId { get; set; }

        public string Name { get; set; }

        public ExpenseCategory Category { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
