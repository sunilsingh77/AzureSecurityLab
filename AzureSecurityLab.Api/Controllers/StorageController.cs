
using Azure;
using AzureSecurityLab.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace AzureSecurityLab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class StorageController : ControllerBase
{
    private readonly AzureBlobStorageService _storageService;
    private readonly ILogger<StorageController> _logger;
    public StorageController(
        AzureBlobStorageService storageService,
        ILogger<StorageController> logger)
    {
        _storageService = storageService;
        _logger = logger;
    }

    [HttpPost("upload")]
    [RequiredScope("access_as_user")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Upload([FromForm] IFormFile? file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new
            {
                Message = "Please select a non-empty file."
            });
        }

        try
        {
            await using var stream = file.OpenReadStream();

            var blobName = await _storageService.UploadAsync(
                stream,
                file.FileName,
                cancellationToken);

            return Ok(new
            {
                Message = "File uploaded successfully.",
                BlobName = blobName,
                OriginalFileName = Path.GetFileName(file.FileName),
                Size = file.Length
            });
        }
        catch (RequestFailedException ex)
        {
            _logger.LogError(ex, "Azure Blob upload failed.");

            return Problem(
                title: "Blob upload failed",
                detail: "Check API logs and Storage permissions.",
                statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("download/{blobName}")]
    [RequiredScope("access_as_user")]
    public async Task<IActionResult> Download(
        string blobName,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(blobName) ||
            blobName.Contains('/') ||
            blobName.Contains('\\') ||
            blobName.Contains(".."))
        {
            return BadRequest(new
            {
                Message = "Invalid blob name."
            });
        }

        try
        {
            var stream = await _storageService.DownloadAsync(
                blobName,
                cancellationToken);

            return File(
                stream,
                "application/octet-stream",
                blobName);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return NotFound(new
            {
                Message = "Blob not found."
            });
        }
        catch (RequestFailedException ex)
        {
            _logger.LogError(ex, "Azure Blob download failed.");

            return Problem(
                title: "Blob download failed",
                detail: "Check API logs and Storage permissions.",
                statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}
