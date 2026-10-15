using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AzureSecurityLab.Api.Controllers;

[ApiController]
[Route("api/security/rate-limit-test")]
public class RateLimitTestController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [EnableRateLimiting("RateLimitLab")]
    public IActionResult Get()
    {
        return Ok(new
        {
            message = "Rate limit test successful",
            timestampUtc = DateTimeOffset.UtcNow
        });
    }
}