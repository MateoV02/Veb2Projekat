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
    [Route("api/trips/{tripId:guid}/activities")]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivitiesController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAll(Guid tripId)
        {
            var activities = await _activityService.GetAllForTripAsync(GetCurrentUserId(), tripId);
            if (activities == null)
            {
                return NotFound();
            }

            return Ok(activities);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ActivityDto>> GetById(Guid tripId, Guid id)
        {
            var activity = await _activityService.GetByIdAsync(GetCurrentUserId(), tripId, id);
            if (activity == null)
            {
                return NotFound();
            }

            return Ok(activity);
        }

        [HttpPost]
        public async Task<ActionResult<ActivityDto>> Create(Guid tripId, [FromBody] ActivityRequestDto request)
        {
            var activity = await _activityService.CreateAsync(GetCurrentUserId(), tripId, request);
            if (activity == null)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetById), new { tripId, id = activity.Id }, activity);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ActivityDto>> Update(Guid tripId, Guid id, [FromBody] ActivityRequestDto request)
        {
            var activity = await _activityService.UpdateAsync(GetCurrentUserId(), tripId, id, request);
            if (activity == null)
            {
                return NotFound();
            }

            return Ok(activity);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid tripId, Guid id)
        {
            var deleted = await _activityService.DeleteAsync(GetCurrentUserId(), tripId, id);
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
