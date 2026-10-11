using Azure.Core;
using Azure.Identity;
using Microsoft.Data.SqlClient;

namespace AzureSecurityLab.Api.Services;

public sealed class AzureSqlService
{
    private readonly string _connectionString;
    private readonly DefaultAzureCredential _credential;

    public AzureSqlService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("AzureSql") ?? throw new InvalidOperationException("ConnectionStrings:AzureSql is missing.");
        _credential = new DefaultAzureCredential();
    }

    public async Task<IReadOnlyList<SecurityLabRecord>> GetRecordsAsync(CancellationToken cancellationToken = default)
    {
        var records = new List<SecurityLabRecord>();
        await using var connection = new SqlConnection(_connectionString);

        AccessToken token = await _credential.GetTokenAsync(new TokenRequestContext(["https://database.windows.net/.default"]), cancellationToken);
        connection.AccessToken = token.Token;

        await connection.OpenAsync(cancellationToken);
        const string sql = """
            SELECT Id, RecordName, CreatedAtUtc
            FROM dbo.SecurityLabRecords
            ORDER BY Id;
            """;

        await using var command = new SqlCommand(sql, connection);
        await using var reader =  await command.ExecuteReaderAsync(cancellationToken);

        while (await reader.ReadAsync(cancellationToken))
        {
            records.Add(new SecurityLabRecord(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetDateTime(2)));
        }

        return records;
    }


    public async Task<SecurityLabRecord> InsertRecordAsync(
        string recordName,
        CancellationToken cancellationToken = default)
    {
        await using var connection = new SqlConnection(_connectionString);

        AccessToken token = await _credential.GetTokenAsync(
            new TokenRequestContext(
                ["https://database.windows.net/.default"]),
            cancellationToken);

        connection.AccessToken = token.Token;

        await connection.OpenAsync(cancellationToken);

        const string sql = """
        INSERT INTO dbo.SecurityLabRecords (RecordName)
        OUTPUT INSERTED.Id, INSERTED.RecordName, INSERTED.CreatedAtUtc
        VALUES (@RecordName);
        """;

        await using var command = new SqlCommand(sql, connection);

        command.Parameters.Add(
            "@RecordName",
            System.Data.SqlDbType.NVarChar,
            100).Value = recordName;

        await using var reader = await command.ExecuteReaderAsync(
            cancellationToken);

        if (!await reader.ReadAsync(cancellationToken))
        {
            throw new InvalidOperationException(
                "The insert did not return the inserted record.");
        }

        return new SecurityLabRecord(
            reader.GetInt32(0),
            reader.GetString(1),
            reader.GetDateTime(2));
    }

}

public sealed record SecurityLabRecord(
    int Id,
    string RecordName,
    DateTime CreatedAtUtc);