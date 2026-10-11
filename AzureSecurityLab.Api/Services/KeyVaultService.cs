using Azure.Security.KeyVault.Secrets;

namespace AzureSecurityLab.Api.Services;

public class KeyVaultService
{
    private readonly SecretClient _secretClient;
    public KeyVaultService(SecretClient secretClient)
    {
        _secretClient = secretClient;
    }

    public async Task<string?> GetSecretAsync(string secretName, CancellationToken cancellationToken = default)
    {
        KeyVaultSecret secret = await _secretClient.GetSecretAsync(secretName, cancellationToken: cancellationToken);
        return secret.Value;
    }
}