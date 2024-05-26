namespace api.Models.Errors;

public class ApiException
{
    public string? Id { get; set; }
    public int StatusCode { get; set; }
    public string? Message { get; set; }
    public string? Details { get; set; }
    public DateTime Time { get; set; }
};
