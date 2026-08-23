using System;

namespace ExpenseService.Dtos
{
    public class BudgetSummaryDto
    {
        public Guid TripPlanId { get; set; }

        public decimal PlannedBudget { get; set; }

        public decimal TotalSpent { get; set; }

        public decimal RemainingBudget { get; set; }
    }
}
