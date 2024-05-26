namespace api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHostEnvironment _env;
    private readonly IMongoCollection<ApiException> _collection;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next, IHostEnvironment env,
        IMongoClient client, IMyMongoDbSettings dbSettings,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
        _env = env;

        var dbName = client.GetDatabase(dbSettings.DatabaseName);
        _collection = dbName.GetCollection<ApiException>(AppVariablesExtensions.collectionExceptionLogs);
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            context.Response.ContentType = "application/text";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            ApiException response = new()
            {
                Id = null,
                StatusCode = context.Response.StatusCode,
                Message = ex.Message,
                Details = ex.StackTrace?.ToString(),
                Time = DateTime.Now
            };

            await _collection.InsertOneAsync(response);

            if (_env.IsProduction())
                response.Details = "Internal Server Error.";

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}
