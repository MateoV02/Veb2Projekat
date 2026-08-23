using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ExpenseService.Dtos;

namespace ExpenseService.Services
{
    public interface IExpenseRecordService
    {
        Task<IEnumerable<ExpenseDto>> GetAllForTripAsync(Guid userId, Guid tripId);

        Task<ExpenseDto> GetByIdAsync(Guid userId, Guid expenseId);

        Task<(ExpenseDto Expense, bool TripNotFound)> CreateAsync(Guid userId, string bearerToken, ExpenseRequestDto request);

        Task<ExpenseDto> UpdateAsync(Guid userId, Guid expenseId, ExpenseRequestDto request);

        Task<bool> DeleteAsync(Guid userId, Guid expenseId);

        Task<BudgetSummaryDto> GetBudgetSummaryAsync(Guid userId, Guid tripId, string bearerToken);
    }
}
