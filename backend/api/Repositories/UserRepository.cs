namespace api.Repositories;

public class UserRepository : IUserRepository
{
    #region Constructor
    // field / class members
    private readonly IMongoCollection<AppUser> _collection; // add private readonly
    private readonly ILogger<UserRepository> _logger;
    private readonly IPhotoService _photoService;

    public UserRepository(IMongoClient client, IMyMongoDbSettings dbSettings, IPhotoService photoService, ILogger<UserRepository> logger)
    {
        var database = client.GetDatabase(dbSettings.DatabaseName);
        _collection = database.GetCollection<AppUser>(AppVariablesExtensions.collectionUsers);
        _photoService = photoService;
        _logger = logger;
    }
    #endregion Constructor

    #region User Management
    public async Task<AppUser?> GetByIdAsync(string? userId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userId)) return null;

        AppUser appUser = await _collection.Find<AppUser>(user
            => user.Id.ToString() == userId).FirstOrDefaultAsync(cancellationToken);

        return appUser;
    }

    public async Task<UpdateResult?> UpdateUserAsync(UserUpdateDto userUpdateDto, string? userId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userId)) return null;

        UpdateDefinition<AppUser> updatedUser = Builders<AppUser>.Update
        .Set(appUser => appUser.Introduction, userUpdateDto.Introduction?.Trim())
        .Set(appUser => appUser.LookingFor, userUpdateDto.LookingFor?.Trim())
        .Set(appUser => appUser.Interests, userUpdateDto.Interests?.Trim())
        .Set(appUser => appUser.City, userUpdateDto.City?.Trim().ToLower())
        .Set(appUser => appUser.Country, userUpdateDto.Country?.Trim().ToLower());

        return await _collection.UpdateOneAsync<AppUser>(appUser => appUser.Id.ToString() == userId, updatedUser, null, cancellationToken);
    }
    #endregion User Management

    #region Photo Management
    public async Task<Photo?> UploadPhotoAsync(IFormFile file, string? userId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userId)) return null;

        AppUser? appUser = await GetByIdAsync(userId, cancellationToken);
        if (appUser is null)
        {
            _logger.LogError("appUser is Null / not found");
            return null;
        }

        // userId, appUser, file
        // save file in Storage using PhotoService / userId makes the folder name
        string[]? imageUrls = await _photoService.AddPhotoToDisk(file, userId);

        if (imageUrls is not null)
        {
            Photo photo;

            // if (appUser.Photos.Count == 0) // if user's album is empty set IsMain: true
            // {
            //     photo = Mappers.ConvertPhotoUrlsToPhoto(imageUrls, isMain: true);
            // }
            // else // user's album is not empty
            // {
            //     photo = Mappers.ConvertPhotoUrlsToPhoto(imageUrls, isMain: false);
            // }
            photo = appUser.Photos.Count == 0
                ? Mappers.ConvertPhotoUrlsToPhoto(imageUrls, isMain: true)
                : Mappers.ConvertPhotoUrlsToPhoto(imageUrls, isMain: false);

            // save to DB
            appUser.Photos.Add(photo);

            var updatedUser = Builders<AppUser>.Update
                .Set(doc => doc.Photos, appUser.Photos);
            // .Set(doc => doc.City, "Tehran");

            UpdateResult result = await _collection.UpdateOneAsync<AppUser>(doc => doc.Id.ToString() == userId, updatedUser, null, cancellationToken);

            // return the saved photo if save on disk and DB is successfull.
            return result.ModifiedCount == 1 ? photo : null;
        }

        _logger.LogError("PhotoService saving photo to disk failed.");
        return null;
    }

    public async Task<UpdateResult?> SetMainPhotoAsync(string? userId, string photoUrlIn, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userId)) return null;

        #region  UNSET the previous main photo: Find the photo with IsMain True; update IsMain to False
        // set query
        FilterDefinition<AppUser>? filterOld = Builders<AppUser>.Filter
            .Where(appUser =>
                appUser.Id.ToString() == userId && appUser.Photos.Any<Photo>(photo => photo.IsMain == true));

        UpdateDefinition<AppUser>? updateOld = Builders<AppUser>.Update
            .Set(appUser => appUser.Photos.FirstMatchingElement().IsMain, false);

        // UpdateOneAsync(appUser => appUser.Photos.IsMain, false, null, cancellationToken);
        await _collection.UpdateOneAsync(filterOld, updateOld, null, cancellationToken);
        #endregion

        #region  SET the new main photo: find new photo by its Url_165; update IsMain to True
        FilterDefinition<AppUser>? filterNew = Builders<AppUser>.Filter
            .Where(appUser =>
                appUser.Id.ToString() == userId && appUser.Photos.Any<Photo>(photo => photo.Url_165 == photoUrlIn));

        UpdateDefinition<AppUser>? updateNew = Builders<AppUser>.Update
            .Set(appUser => appUser.Photos.FirstMatchingElement().IsMain, true);

        return await _collection.UpdateOneAsync(filterNew, updateNew, null, cancellationToken);
        #endregion
    }

    public async Task<UpdateResult?> DeletePhotoAsync(string? userId, string? url_165_In, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(url_165_In)) return null;

        // Find the photo in AppUser
        Photo photo = await _collection.AsQueryable()
            .Where(appUser => appUser.Id.ToString() == userId) // filter by user email
            .SelectMany(appUser => appUser.Photos) // flatten the Photos array
            .Where(photo => photo.Url_165 == url_165_In) // filter by photo url
            .FirstOrDefaultAsync(cancellationToken); // return the photo or null

        if (photo is null) return null; // Warning: should be handled with Exception handling Middlewear to log the app's bug since it's a bug!

        if (photo.IsMain) return null; // prevent from deleting main photo!

        bool isDeleteSuccess = await _photoService.DeletePhotoFromDisk(photo);
        if (!isDeleteSuccess)
        {
            _logger.LogError("Delete from disk failed.");
            return null;
        }

        var update = Builders<AppUser>.Update
            .PullFilter(appUser => appUser.Photos, photo => photo.Url_165 == url_165_In);

        return await _collection.UpdateOneAsync<AppUser>(appUser => appUser.Id.ToString() == userId, update, null, cancellationToken);
    }
    #endregion Photo Management
}
