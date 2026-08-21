using System;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityService.Dtos;
using IdentityService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/identity/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            var user = await _userService.GetByIdAsync(Guid.Parse(idClaim));

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }
    }
}
