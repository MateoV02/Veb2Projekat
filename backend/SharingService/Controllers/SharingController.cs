using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharingService.Dtos;
using SharingService.Services;

namespace SharingService.Controllers
{
    [ApiController]
    [Route("api/sharing")]
    public class SharingController : ControllerBase
    {
        private readonly ISharingLinkService _sharingLinkService;

        public SharingController(ISharingLinkService sharingLinkService)
        {
            _sharingLinkService = sharingLinkService;
        }

        [Authorize]
        [HttpPost("trips/{tripId:guid}/links")]
        public async Task<ActionResult<ShareLinkDto>> CreateLink(Guid tripId, [FromBody] CreateShareLinkRequestDto request)
        {
            var link = await _sharingLinkService.CreateAsync(GetCurrentUserId(), GetBearerToken(), tripId, request.AccessType);
            if (link == null)
            {
                return NotFound(new { message = "Plan putovanja nije pronađen." });
            }

            return StatusCode(201, link);
        }

        [Authorize]
        [HttpGet("trips/{tripId:guid}/links")]
        public async Task<ActionResult<object>> GetLinks(Guid tripId)
        {
            var links = await _sharingLinkService.GetAllForTripAsync(GetCurrentUserId(), tripId);
            return Ok(links);
        }

        [Authorize]
        [HttpDelete("links/{token}")]
        public async Task<IActionResult> RevokeLink(string token)
        {
            var revoked = await _sharingLinkService.RevokeAsync(GetCurrentUserId(), token);
            if (!revoked)
            {
                return NotFound();
            }

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("validate/{token}")]
        public async Task<ActionResult<TokenValidationDto>> Validate(string token)
        {
            var result = await _sharingLinkService.ValidateAsync(token);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
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
