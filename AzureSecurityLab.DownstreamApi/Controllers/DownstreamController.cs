using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AzureSecurityLab.DownstreamApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "DownstreamInvokerOnly")]
public sealed class DownstreamController : ControllerBase
{
    [HttpGet("data")]
    public IActionResult GetData()
    {
        return Ok(new
        {
            Service = "AzureSecurityLab.DownstreamApi",
            Message = "Authorized downstream API call successful.",
            TimestampUtc = DateTime.UtcNow
        });
    }
}