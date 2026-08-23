using System;

namespace ExpenseService.Models
{
    public class Expense
    {
        public Guid Id { get; set; }

        public Guid TripPlanId { get; set; }

        public Guid UserId { get; set; }

        public string Name { get; set; }

        public ExpenseCategory Category { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
