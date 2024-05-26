

namespace api.Repositories;

public class MemberRepository : IMemberRepository
{
    #region Constructor
    IMongoCollection<AppUser>? _collection;

    public MemberRepository(IMongoClient client, IMyMongoDbSettings dbSettings)
    {
        var database = client.GetDatabase(dbSettings.DatabaseName);
        _collection = database.GetCollection<AppUser>(AppVariablesExtensions.collectionUsers);
    }
    #endregion Constructor

    public async Task<PagedList<AppUser>> GetAllAsync(PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        IMongoQueryable<AppUser> query = _collection.AsQueryable();

        return await PagedList<AppUser>.CreatePagedListAsync(query, paginationParams.PageNumber, paginationParams.PageSize, cancellationToken);
    }

    public async Task<MemberDto?> GetByIdAsync(string memberId, CancellationToken cancellationToken)
    {
        AppUser appUser = await _collection.Find<AppUser>(appUser =>
                appUser.Id.ToString() == memberId).FirstOrDefaultAsync(cancellationToken);

        if (appUser.Id.ToString() is not null)
        {
            return Mappers.ConvertAppUserToMemberDto(appUser);
        }

        return null;
    }

    public async Task<MemberDto?> GetByEmailAsync(string memberEmail, CancellationToken cancellationToken)
    {
        AppUser appUser = await _collection.Find<AppUser>(appUser =>
                appUser.NormalizedEmail == memberEmail).FirstOrDefaultAsync(cancellationToken);

        if (appUser.Id.ToString() is not null)
        {
            return Mappers.ConvertAppUserToMemberDto(appUser);
        }

        return null;
    }
}
