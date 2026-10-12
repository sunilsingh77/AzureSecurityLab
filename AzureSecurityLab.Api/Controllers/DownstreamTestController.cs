
using AzureSecurityLab.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AzureSecurityLab.Api.Controllers;

[ApiController]
[Route("api/security/downstream")]
[Authorize]
public sealed class DownstreamTestController : ControllerBase
{
    private readonly DownstreamApiService _downstreamApiService;
    private readonly ILogger<DownstreamTestController> _logger;
    public DownstreamTestController(DownstreamApiService downstreamApiService, ILogger<DownstreamTestController> logger)
    {
        _downstreamApiService = downstreamApiService;
        _logger = logger;
    }

    [HttpGet("test")]
    public async Task<IActionResult> Test(CancellationToken cancellationToken)
    {
        try
        {
            var result = await _downstreamApiService.GetDataAsync(cancellationToken);
            return Content(result, "application/json");
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "The downstream API request failed.");
            return StatusCode(StatusCodes.Status502BadGateway,new { message = "The downstream API request failed." });
        }
        catch (Azure.Identity.AuthenticationFailedException ex)
        {
            _logger.LogError(ex, "Could not acquire a downstream API access token.");
            return StatusCode(StatusCodes.Status502BadGateway, new { message = "Downstream authentication failed." });
        }
    }
}
