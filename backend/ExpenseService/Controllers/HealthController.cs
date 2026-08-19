using Microsoft.AspNetCore.Mvc;

namespace ExpenseService.Controllers
{
    [ApiController]
    [Route("api/expenses/health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "ok", service = "ExpenseService" });
        }
    }
}
