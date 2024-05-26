namespace api.Controllers;

[Authorize(Policy = "RequiredAdminRole")]
public class AdminController(IAdminRepository _adminRepository) : BaseApiController
{
    [HttpGet("users-with-roles")]
    public async Task<ActionResult<IEnumerable<UserWithRoleDto>>> UsersWithRoles()
    {
        IEnumerable<UserWithRoleDto> users = await _adminRepository.GetUsersWithRolesAsync();

        return !users.Any() ? NoContent() : Ok(users);
    }

    [HttpDelete("delete-user/{userName}")]
    public async Task<ActionResult<IEnumerable<UserWithRoleDto>>> DeleteUser(string userName)
    {
        return await _adminRepository.DeleteUserAsync(userName)
            ? Ok(new Response(Message: $""" "{userName}" got deleted successfully."""))
            : BadRequest("User deletion failed.");
    }

    [HttpPut("suspend-user/{userName}")]
    public async Task<ActionResult<IEnumerable<UserWithRoleDto>>> SuspendUser(string userName)
    {
        return await _adminRepository.SuspendUserAsync(userName)
            ? Ok(new Response(Message: $""" "{userName}" got suspended successfully."""))
            : BadRequest("User suspention failed.");
    }
}
