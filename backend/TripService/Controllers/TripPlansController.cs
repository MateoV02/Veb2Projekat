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
    [Route("api/trips")]
    public class TripPlansController : ControllerBase
    {
        private readonly ITripPlanService _tripPlanService;

        public TripPlansController(ITripPlanService tripPlanService)
        {
            _tripPlanService = tripPlanService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAll()
        {
            var trips = await _tripPlanService.GetAllForUserAsync(GetCurrentUserId());
            return Ok(trips);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TripPlanDto>> GetById(Guid id)
        {
            var trip = await _tripPlanService.GetByIdAsync(GetCurrentUserId(), id);
            if (trip == null)
            {
                return NotFound();
            }

            return Ok(trip);
        }

        [HttpPost]
        public async Task<ActionResult<TripPlanDto>> Create([FromBody] TripPlanRequestDto request)
        {
            var trip = await _tripPlanService.CreateAsync(GetCurrentUserId(), request);
            return CreatedAtAction(nameof(GetById), new { id = trip.Id }, trip);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<TripPlanDto>> Update(Guid id, [FromBody] TripPlanRequestDto request)
        {
            var trip = await _tripPlanService.UpdateAsync(GetCurrentUserId(), id, request);
            if (trip == null)
            {
                return NotFound();
            }

            return Ok(trip);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _tripPlanService.DeleteAsync(GetCurrentUserId(), id);
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
