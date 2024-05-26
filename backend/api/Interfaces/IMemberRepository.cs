namespace api.Interfaces;

public interface IMemberRepository
{
    public Task<PagedList<AppUser>> GetAllAsync(PaginationParams paginationParams, CancellationToken cancellationToken);

    public Task<MemberDto?> GetByIdAsync(string memberId, CancellationToken cancellationToken);
    
    public Task<MemberDto?> GetByEmailAsync(string memberEmail, CancellationToken cancellationToken);
}
