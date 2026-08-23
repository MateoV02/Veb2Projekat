using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ExpenseService.Dtos;
using ExpenseService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseService.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/expenses")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseRecordService _expenseRecordService;

        public ExpensesController(IExpenseRecordService expenseRecordService)
        {
            _expenseRecordService = expenseRecordService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAll([FromQuery] Guid tripId)
        {
            var expenses = await _expenseRecordService.GetAllForTripAsync(GetCurrentUserId(), tripId);
            return Ok(expenses);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ExpenseDto>> GetById(Guid id)
        {
            var expense = await _expenseRecordService.GetByIdAsync(GetCurrentUserId(), id);
            if (expense == null)
            {
                return NotFound();
            }

            return Ok(expense);
        }

        [HttpGet("summary/{tripId:guid}")]
        public async Task<ActionResult<BudgetSummaryDto>> GetBudgetSummary(Guid tripId)
        {
            var summary = await _expenseRecordService.GetBudgetSummaryAsync(GetCurrentUserId(), tripId, GetBearerToken());
            if (summary == null)
            {
                return NotFound();
            }

            return Ok(summary);
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> Create([FromBody] ExpenseRequestDto request)
        {
            var (expense, tripNotFound) = await _expenseRecordService.CreateAsync(
                GetCurrentUserId(), GetBearerToken(), request);

            if (tripNotFound)
            {
                return NotFound(new { message = "Plan putovanja nije pronađen." });
            }

            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ExpenseDto>> Update(Guid id, [FromBody] ExpenseRequestDto request)
        {
            var expense = await _expenseRecordService.UpdateAsync(GetCurrentUserId(), id, request);
            if (expense == null)
            {
                return NotFound();
            }

            return Ok(expense);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _expenseRecordService.DeleteAsync(GetCurrentUserId(), id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return Guid.Parse(idClaim);
        }

        private string GetBearerToken()
        {
            var header = Request.Headers.Authorization.ToString();
            return header.StartsWith("Bearer ") ? header["Bearer ".Length..] : header;
        }
    }
}
