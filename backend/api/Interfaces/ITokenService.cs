namespace api.Interfaces;
public interface ITokenService
{
    public Task<string?> CreateToken(AppUser user, CancellationToken cancellationToken);
    public Task<ObjectId?> GetActualUserId(string? userIdHashed, CancellationToken cancellationToken);

}