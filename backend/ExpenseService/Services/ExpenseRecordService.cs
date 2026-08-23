using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ExpenseService.Clients;
using ExpenseService.Data;
using ExpenseService.Dtos;
using ExpenseService.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseService.Services
{
    public class ExpenseRecordService : IExpenseRecordService
    {
        private readonly ExpenseDbContext _dbContext;
        private readonly ITripServiceClient _tripServiceClient;
        private readonly IMapper _mapper;

        public ExpenseRecordService(ExpenseDbContext dbContext, ITripServiceClient tripServiceClient, IMapper mapper)
        {
            _dbContext = dbContext;
            _tripServiceClient = tripServiceClient;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ExpenseDto>> GetAllForTripAsync(Guid userId, Guid tripId)
        {
            var expenses = await _dbContext.Expenses
                .Where(e => e.TripPlanId == tripId && e.UserId == userId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ExpenseDto>>(expenses);
        }

        public async Task<ExpenseDto> GetByIdAsync(Guid userId, Guid expenseId)
        {
            var expense = await FindOwnedExpenseAsync(userId, expenseId);
            return expense == null ? null : _mapper.Map<ExpenseDto>(expense);
        }

        public async Task<(ExpenseDto Expense, bool TripNotFound)> CreateAsync(
            Guid userId, string bearerToken, ExpenseRequestDto request)
        {
            var trip = await _tripServiceClient.GetTripAsync(request.TripPlanId, bearerToken);
            if (trip == null)
            {
                return (null, true);
            }

            var expense = new Expense
            {
                Id = Guid.NewGuid(),
                TripPlanId = request.TripPlanId,
                UserId = userId,
                Name = request.Name,
                Category = request.Category,
                Amount = request.Amount,
                Date = request.Date,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Expenses.Add(expense);
            await _dbContext.SaveChangesAsync();

            return (_mapper.Map<ExpenseDto>(expense), false);
        }

        public async Task<ExpenseDto> UpdateAsync(Guid userId, Guid expenseId, ExpenseRequestDto request)
        {
            var expense = await FindOwnedExpenseAsync(userId, expenseId);
            if (expense == null)
            {
                return null;
            }

            expense.Name = request.Name;
            expense.Category = request.Category;
            expense.Amount = request.Amount;
            expense.Date = request.Date;
            expense.Description = request.Description;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<ExpenseDto>(expense);
        }

        public async Task<bool> DeleteAsync(Guid userId, Guid expenseId)
        {
            var expense = await FindOwnedExpenseAsync(userId, expenseId);
            if (expense == null)
            {
                return false;
            }

            _dbContext.Expenses.Remove(expense);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<BudgetSummaryDto> GetBudgetSummaryAsync(Guid userId, Guid tripId, string bearerToken)
        {
            var trip = await _tripServiceClient.GetTripAsync(tripId, bearerToken);
            if (trip == null)
            {
                return null;
            }

            var totalSpent = await _dbContext.Expenses
                .Where(e => e.TripPlanId == tripId && e.UserId == userId)
                .SumAsync(e => (decimal?)e.Amount) ?? 0m;

            return new BudgetSummaryDto
            {
                TripPlanId = tripId,
                PlannedBudget = trip.Budget,
                TotalSpent = totalSpent,
                RemainingBudget = trip.Budget - totalSpent
            };
        }

        private Task<Expense> FindOwnedExpenseAsync(Guid userId, Guid expenseId)
        {
            return _dbContext.Expenses
                .FirstOrDefaultAsync(e => e.Id == expenseId && e.UserId == userId);
        }
    }
}
