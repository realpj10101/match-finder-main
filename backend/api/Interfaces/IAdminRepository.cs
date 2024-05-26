namespace api.Interfaces;

public interface IAdminRepository
{
    public Task<IEnumerable<UserWithRoleDto>> GetUsersWithRolesAsync();
    public Task<bool> DeleteUserAsync(string userName);
    public Task<bool> SuspendUserAsync(string userName);
}
