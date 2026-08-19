using Microsoft.AspNetCore.Mvc;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/trips/health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "ok", service = "TripService" });
        }
    }
}
