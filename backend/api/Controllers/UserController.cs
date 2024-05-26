using api.Extensions.Validations;

namespace api.Controllers;

[Authorize] // AllowAnonymous can NOT be here!
public class UserController(IUserRepository _userRepository) : BaseApiController // move Using to GlobalUsing.cs
{
    #region User Management
    [HttpPut]
    public async Task<ActionResult> UpdateUser(UserUpdateDto userUpdateDto, CancellationToken cancellationToken)
    {
        UpdateResult? updateResult = await _userRepository.UpdateUserAsync(userUpdateDto, User.GetUserId(), cancellationToken);

        return updateResult is null || updateResult.ModifiedCount == 0
            ? BadRequest("Update failed. Try again later.")
            : Ok(new { message = "User has been updated successfully." });
    }

    // [AllowAnonymous] // if Auth is NOT needed
    // [HttpGet("get-by-id")]
    // public async Task<ActionResult<UserDto>> GetById(CancellationToken cancellationToken)
    // {
    //     // string? userId = User.GetUserId();

    //     UserDto? userDto = await _userRepository.GetByIdAsync(User.GetUserId(), cancellationToken);

    //     if (userDto is null)
    //         return NotFound("No user was found");

    //     return userDto;
    // }
    #endregion User Management

    #region Photo Management
    // only jpeg, jpg, png. Between 250KB(500x500) and 4MB(2000x2000)
    [HttpPost("add-photo")]
    public async Task<ActionResult<Photo>> AddPhoto(
            [AllowedFileExtensions, FileSize(500 * 500, 2000 * 2000)]
            IFormFile file, CancellationToken cancellationToken
        )
    {
        if (file is null) return BadRequest("No file is selected with this request.");

        /*                          ** Photo Upload Steps/Process **
            UserController => UserRepository: GetById() => PhotoService => PhotoModifySaveService
            PhotoService => UserRepository: MongoDb, return Photo => UserController
        */
        Photo? photo = await _userRepository.UploadPhotoAsync(file, User.GetUserId(), cancellationToken);

        return photo is null ? BadRequest("Add photo failed. See logger") : photo;
    }

    [HttpPut("set-main-photo")]
    public async Task<ActionResult> SetMainPhoto(string photoUrlIn, CancellationToken cancellationToken)
    {
        UpdateResult? updateResult = await _userRepository.SetMainPhotoAsync(User.GetUserId(), photoUrlIn, cancellationToken);

        return updateResult is null || updateResult.ModifiedCount == 0
            ? BadRequest("Set as main photo failed. Try again in a few moments. If the issue persists contact the admin.")
            : Ok(new { message = "Set this photo as main succeeded." });
    }

    [HttpPut("delete-photo")]
    public async Task<ActionResult> DeletePhoto(string photoUrlIn, CancellationToken cancellationToken)
    {
        UpdateResult? updateResult = await _userRepository.DeletePhotoAsync(User.GetUserId(), photoUrlIn, cancellationToken);

        return updateResult is null || updateResult.ModifiedCount == 0
            ? BadRequest("Photo deletion failed. Try again in a few moments. If the issue persists contact the admin.")
            : Ok(new { message = "Photo deleted successfully." });
    }
    #endregion Photo Management

    // storage/photos/65748e99ad5744a259f99bc2/resize-pixel-square/165x165/1cd2e887-43b5-4797-9b90-7f4979284b45_pexels-pixabay-220429.webp
}
