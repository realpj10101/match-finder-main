namespace api.Interfaces;

public interface IUserRepository
{
    public Task<AppUser?> GetByIdAsync(string? userId, CancellationToken cancellationToken);

    public Task<UpdateResult?> UpdateUserAsync(UserUpdateDto userUpdateDto, string? userId, CancellationToken cancellationToken);

    public Task<Photo?> UploadPhotoAsync(IFormFile file, string? userId, CancellationToken cancellationToken);

    public Task<UpdateResult?> SetMainPhotoAsync(string? userId, string photoUrlIn, CancellationToken cancellationToken);

    public Task<UpdateResult?> DeletePhotoAsync(string? userId, string? urlIn, CancellationToken cancellationToken);
}
