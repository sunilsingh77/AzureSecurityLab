using AzureSecurityLab.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Identity.Web.Resource;
using System.Data;
using System.Security.Claims;

namespace AzureSecurityLab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SecurityController : ControllerBase
{
    private readonly ILogger<SecurityController> _logger;
    private readonly IConfiguration _configuration;

    public SecurityController(ILogger<SecurityController> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    [HttpGet("public")]
    [AllowAnonymous]
    public IActionResult Public()
    {
        return Ok(new
        {
            Message = "Public endpoint"
        });
    }

    //[HttpGet("profile")]
    //[Authorize(Policy = "ApiAccess")]
    //public IActionResult Profile()
    //{
    //    return Ok(new
    //    {
    //        Message = "Authenticated API access successful.",
    //        User = User.Identity?.Name,
    //        ObjectId = User.FindFirst("oid")?.Value,
    //        TenantId = User.FindFirst("tid")?.Value,
    //        Scopes = User.FindFirst("scp")?.Value,
    //        Roles = User.FindAll("roles")
    //                   .Select(x => x.Value)
    //                   .ToArray()
    //    });
    //}

    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return Ok(new
        {
            IsAuthenticated = User.Identity?.IsAuthenticated,

            Name = User.Identity?.Name,

            Claims = User.Claims.Select(c => new
            {
                c.Type,
                c.Value
            })
        });
    }

    //[HttpGet("admin")]
    //[Authorize(Policy = "AdminOnly")]
    //public IActionResult Admin()
    //{
    //    return Ok(new
    //    {
    //        Message = "Admin API access successful.",
    //        User = User.Identity?.Name,
    //        Roles = User.FindAll("roles")
    //                   .Select(x => x.Value)
    //                   .ToArray()
    //    });
    //}

    [HttpGet("admin")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Admin()
    {
        return Ok(new
        {
            Message = "Admin access successful.",
            IsAuthenticated = User.Identity?.IsAuthenticated,
            User = User.Identity?.Name,
            IsAdmin = User.IsInRole("Admin"),
            RoleClaimType = (User.Identity as ClaimsIdentity)?.RoleClaimType,
            AllClaims = User.Claims.Select(c => new
            {
                Type = c.Type,
                Value = c.Value
            })
        });
    }

    [HttpGet("keyvault-test")]
    [RequiredScope("access_as_user")]
    public async Task<IActionResult> KeyVaultTest(
        [FromServices] KeyVaultService keyVaultService,
        CancellationToken cancellationToken)
    {
        var secret = await keyVaultService.GetSecretAsync(
            "Lab-TestSecret",
            cancellationToken);

        return Ok(new
        {
            Message = "Key Vault access successful.",
            Secret = secret
        });
    }

    // Preserve your existing profile, Key Vault,
    // and other actions here.

    [HttpGet("sql-test")]
    public async Task<IActionResult> SqlTest(
        [FromServices] AzureSqlService sqlService,
        CancellationToken cancellationToken)
    {
        var records = await sqlService.GetRecordsAsync(
            cancellationToken);

        return Ok(new
        {
            Database = "AzureSecurityLabDb",
            Count = records.Count,
            Records = records
        });
    }

    [HttpPost("sql-test/insert")]
    [RequiredScope("access_as_user")]
    public async Task<IActionResult> InsertSqlTestRecord(
        [FromServices] AzureSqlService sqlService,
        CancellationToken cancellationToken)
    {
        const string recordName = "Managed Identity Insert Test";

        try
        {
            var record = await sqlService.InsertRecordAsync(
                recordName,
                cancellationToken);

            return Ok(new
            {
                Message = "Record inserted successfully.",
                Id = record.Id,
                RecordName = record.RecordName,
                CreatedAtUtc = record.CreatedAtUtc
            });
        }
        catch (SqlException ex)
        {
            _logger.LogError(
                ex,
                "SQL Managed Identity insert test failed.");

            return Problem(
                title: "SQL insert test failed",
                detail: "Check the API application logs for the database error.",
                statusCode: StatusCodes.Status500InternalServerError);
        }
    }


}