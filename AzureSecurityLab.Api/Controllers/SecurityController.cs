using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace AzureSecurityLab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SecurityController : ControllerBase
{
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
    [Authorize]
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
}