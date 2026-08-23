using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.Clients;
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
        private readonly ISharingServiceClient _sharingServiceClient;

        public TripPlansController(ITripPlanService tripPlanService, ISharingServiceClient sharingServiceClient)
        {
            _tripPlanService = tripPlanService;
            _sharingServiceClient = sharingServiceClient;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAll()
        {
            var trips = await _tripPlanService.GetAllForUserAsync(GetCurrentUserId());
            return Ok(trips);
        }

        /// <summary>
        /// Pregled plana: dozvoljen vlasniku (JWT) ili bilo kome ko ima validan share token
        /// (i VIEW i EDIT nivo pristupa dozvoljavaju pregled).
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TripPlanDto>> GetById(Guid id, [FromHeader(Name = "X-Share-Token")] string shareToken)
        {
            var userId = TryGetCurrentUserId();
            if (userId.HasValue)
            {
                var ownTrip = await _tripPlanService.GetByIdAsync(userId.Value, id);
                if (ownTrip != null)
                {
                    return Ok(ownTrip);
                }
            }

            if (!string.IsNullOrEmpty(shareToken))
            {
                var validation = await _sharingServiceClient.ValidateAsync(shareToken);
                if (validation != null && validation.TripPlanId == id)
                {
                    var sharedTrip = await _tripPlanService.GetByIdSharedAsync(id);
                    if (sharedTrip != null)
                    {
                        return Ok(sharedTrip);
                    }
                }
            }

            return NotFound();
        }

        [HttpPost]
        public async Task<ActionResult<TripPlanDto>> Create([FromBody] TripPlanRequestDto request)
        {
            var trip = await _tripPlanService.CreateAsync(GetCurrentUserId(), request);
            return CreatedAtAction(nameof(GetById), new { id = trip.Id }, trip);
        }

        /// <summary>
        /// Izmena plana: dozvoljena vlasniku (JWT) ili nosiocu share tokena tipa EDIT.
        /// </summary>
        [AllowAnonymous]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<TripPlanDto>> Update(
            Guid id, [FromBody] TripPlanRequestDto request, [FromHeader(Name = "X-Share-Token")] string shareToken)
        {
            var userId = TryGetCurrentUserId();
            if (userId.HasValue)
            {
                var ownTrip = await _tripPlanService.UpdateAsync(userId.Value, id, request);
                if (ownTrip != null)
                {
                    return Ok(ownTrip);
                }
            }

            if (!string.IsNullOrEmpty(shareToken))
            {
                var validation = await _sharingServiceClient.ValidateAsync(shareToken);
                if (validation != null && validation.TripPlanId == id && validation.AccessType == "Edit")
                {
                    var sharedTrip = await _tripPlanService.UpdateSharedAsync(id, request);
                    if (sharedTrip != null)
                    {
                        return Ok(sharedTrip);
                    }
                }
            }

            return NotFound();
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

        private Guid? TryGetCurrentUserId()
        {
            if (!(User.Identity?.IsAuthenticated ?? false))
            {
                return null;
            }

            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return idClaim != null ? Guid.Parse(idClaim) : (Guid?)null;
        }
    }
}
