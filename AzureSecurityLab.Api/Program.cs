using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using AzureSecurityLab.Api.ExceptionHandling;
using AzureSecurityLab.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.OpenApi;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var keyVaultUri = builder.Configuration["KeyVault:Uri"];

if (string.IsNullOrWhiteSpace(keyVaultUri))
{
    throw new InvalidOperationException("KeyVault:Uri is not configured.");
}

builder.Services.AddSingleton<SecretClient>(_ =>
{
    return new SecretClient(new Uri(keyVaultUri), new DefaultAzureCredential());
});

builder.Services.AddScoped<KeyVaultService>();
// ========================================
// Swagger
// ========================================
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AzureSecurityLab Api",
        Version = "v1"
    });
});


// ========================================
// Authentication
// ========================================

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// ========================================
// Authorization
// ========================================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ApiAccess", policy =>
    {
        policy.RequireClaim("scp", "access_as_user");
    });

    options.AddPolicy("AdminOnly", policy =>
    {
        policy.RequireRole("Admin");
    });
});
// ========================================
// Rate Limiting
// ========================================
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("RateLimitLab", httpContext =>
    {
        var clientIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(partitionKey: clientIp,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromSeconds(60),
                QueueLimit = 0,
                AutoReplenishment = true
            });
    });
});
// ========================================
// CORS
// ========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        var allowedOrigins =
            builder.Configuration
                .GetSection("Cors:AllowedOrigins")
                .Get<string[]>() ?? [];

        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    });
});


builder.Services.AddScoped<AzureSqlService>();
builder.Services.AddSingleton<AzureBlobStorageService>();
builder.Services.AddHttpClient<DownstreamApiService>();

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
var app = builder.Build();
app.UseExceptionHandler();
// ========================================
// Middleware
// ========================================
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AzureSecurityLab Api v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AngularClient");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
