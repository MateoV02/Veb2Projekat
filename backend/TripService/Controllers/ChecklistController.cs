using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.Dtos;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/trips/{tripId:guid}/checklist")]
    public class ChecklistController : ControllerBase
    {
        private readonly IChecklistService _checklistService;

        public ChecklistController(IChecklistService checklistService)
        {
            _checklistService = checklistService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAll(Guid tripId)
        {
            var items = await _checklistService.GetAllForTripAsync(GetCurrentUserId(), tripId);
            if (items == null)
            {
                return NotFound();
            }

            return Ok(items);
        }

        [HttpPost]
        public async Task<ActionResult<ChecklistItemDto>> Create(Guid tripId, [FromBody] ChecklistItemRequestDto request)
        {
            var item = await _checklistService.CreateAsync(GetCurrentUserId(), tripId, request);
            if (item == null)
            {
                return NotFound();
            }

            return StatusCode(201, item);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ChecklistItemDto>> Update(Guid tripId, Guid id, [FromBody] ChecklistItemRequestDto request)
        {
            var item = await _checklistService.UpdateAsync(GetCurrentUserId(), tripId, id, request);
            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid tripId, Guid id)
        {
            var deleted = await _checklistService.DeleteAsync(GetCurrentUserId(), tripId, id);
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
    }
}
