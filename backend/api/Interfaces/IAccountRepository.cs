namespace api.Interfaces;

public interface IAccountRepository
{
    public Task<LoggedInDto> CreateAsync(RegisterDto userInput, CancellationToken cancellationToken); // method signature 
    public Task<LoggedInDto> LoginAsync(LoginDto userInput, CancellationToken cancellationToken);
    public Task<LoggedInDto?> ReloadLoggedInUserAsync(string userId, string token, CancellationToken cancellationToken);
    public Task<UpdateResult?> UpdateLastActive(string loggedInUserId, CancellationToken cancellationToken);
}
