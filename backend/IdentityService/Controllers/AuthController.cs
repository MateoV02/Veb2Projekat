using System.Threading.Tasks;
using IdentityService.Dtos;
using IdentityService.Services;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/identity/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterRequestDto request)
        {
            try
            {
                var user = await _userService.RegisterAsync(request);
                return StatusCode(201, user);
            }
            catch (EmailAlreadyExistsException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            var result = await _userService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(new { message = "Pogrešan email ili lozinka." });
            }

            return Ok(result);
        }
    }
}
