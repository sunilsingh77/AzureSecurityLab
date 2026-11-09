
using AzureSecurityLab.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AzureSecurityLab.Api.Controllers;

[ApiController]
[Route("api/security/request-validation")]
public sealed class RequestValidationController : ControllerBase
{
    [HttpPost]
    [AllowAnonymous] // Lab only
    [Consumes("application/json")]
    [RequestSizeLimit(10 * 1024)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status405MethodNotAllowed)]
    [ProducesResponseType(StatusCodes.Status413PayloadTooLarge)]
    [ProducesResponseType(StatusCodes.Status415UnsupportedMediaType)]
    public IActionResult ValidateRequest(
        [FromBody] CreateValidationTestRequest request)
    {
        return Ok(new
        {
            message = "Request validation successful.",
            data = request
        });
    }
}
