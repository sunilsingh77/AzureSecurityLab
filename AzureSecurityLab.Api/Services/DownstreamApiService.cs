
using Azure.Core;
using Azure.Identity;
using System.Net.Http.Headers;

namespace AzureSecurityLab.Api.Services;

public sealed class DownstreamApiService
{
    //private const string Scope = "api://85a66a86-c04e-4d3b-a9ed-3bc917dad24d/.default";
    private readonly string _scope;
    private readonly string _baseUrl;
    private readonly HttpClient _httpClient;
    private readonly TokenCredential _credential;
    private readonly IConfiguration _configuration;

    public DownstreamApiService(HttpClient httpClient, 
        IConfiguration configuration, 
        IWebHostEnvironment environment)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _credential = environment.IsDevelopment() ? new AzureCliCredential() : new ManagedIdentityCredential();


        _scope = _configuration["DownstreamApi:Scope"] ?? throw new InvalidOperationException(
                "DownstreamApi:Scope is missing.");
        _baseUrl = _configuration["DownstreamApi:BaseUrl"] ?? throw new InvalidOperationException(
                "DownstreamApi:BaseUrl is missing.");
    }

    public async Task<string> GetDataAsync(CancellationToken cancellationToken = default)
    {
        var token = await _credential.GetTokenAsync(new TokenRequestContext([_scope]), cancellationToken);
        using var request = new HttpRequestMessage(HttpMethod.Get,$"{_baseUrl}/api/downstream/data");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        response.EnsureSuccessStatusCode();

        return content;
    }
}
