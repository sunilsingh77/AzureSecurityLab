using Azure.Core;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace AzureSecurityLab.Api.Services;

public sealed class AzureBlobStorageService
{
    private readonly BlobContainerClient _containerClient;

    public AzureBlobStorageService(
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        var serviceUri = configuration["AzureBlobStorage:ServiceUri"]
            ?? throw new InvalidOperationException(
                "AzureBlobStorage:ServiceUri is missing.");

        var containerName = configuration["AzureBlobStorage:ContainerName"]
            ?? throw new InvalidOperationException(
                "AzureBlobStorage:ContainerName is missing.");

        TokenCredential credential = environment.IsDevelopment()
            ? new AzureCliCredential()
            : new ManagedIdentityCredential();

        var serviceClient = new BlobServiceClient(
            new Uri(serviceUri),
            credential);

        _containerClient = serviceClient.GetBlobContainerClient(containerName);
    }

    public async Task<string> UploadAsync(
        Stream content,
        string fileName,
        CancellationToken cancellationToken = default)
    {
        var blobName = $"{Guid.NewGuid():N}-{Path.GetFileName(fileName)}";
        var blobClient = _containerClient.GetBlobClient(blobName);

        await blobClient.UploadAsync(
            content,
            overwrite: false,
            cancellationToken);

        return blobName;
    }

    public async Task<Stream> DownloadAsync(
        string blobName,
        CancellationToken cancellationToken = default)
    {
        var blobClient = _containerClient.GetBlobClient(blobName);

        var response = await blobClient.DownloadStreamingAsync(
            cancellationToken: cancellationToken);

        return response.Value.Content;
    }
}