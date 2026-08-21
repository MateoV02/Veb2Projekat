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
    [Route("api/trips/{tripId:guid}/destinations")]
    public class DestinationsController : ControllerBase
    {
        private readonly IDestinationService _destinationService;

        public DestinationsController(IDestinationService destinationService)
        {
            _destinationService = destinationService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetAll(Guid tripId)
        {
            var destinations = await _destinationService.GetAllForTripAsync(GetCurrentUserId(), tripId);
            if (destinations == null)
            {
                return NotFound();
            }

            return Ok(destinations);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<DestinationDto>> GetById(Guid tripId, Guid id)
        {
            var destination = await _destinationService.GetByIdAsync(GetCurrentUserId(), tripId, id);
            if (destination == null)
            {
                return NotFound();
            }

            return Ok(destination);
        }

        [HttpPost]
        public async Task<ActionResult<DestinationDto>> Create(Guid tripId, [FromBody] DestinationRequestDto request)
        {
            var destination = await _destinationService.CreateAsync(GetCurrentUserId(), tripId, request);
            if (destination == null)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetById), new { tripId, id = destination.Id }, destination);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<DestinationDto>> Update(Guid tripId, Guid id, [FromBody] DestinationRequestDto request)
        {
            var destination = await _destinationService.UpdateAsync(GetCurrentUserId(), tripId, id, request);
            if (destination == null)
            {
                return NotFound();
            }

            return Ok(destination);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid tripId, Guid id)
        {
            var deleted = await _destinationService.DeleteAsync(GetCurrentUserId(), tripId, id);
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
