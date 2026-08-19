using Microsoft.AspNetCore.Mvc;

namespace SharingService.Controllers
{
    [ApiController]
    [Route("api/sharing/health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "ok", service = "SharingService" });
        }
    }
}
