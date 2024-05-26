namespace api.Controllers;

[Authorize]
public class MemberController(IMemberRepository _memberRepository) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetAll([FromQuery] PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        PagedList<AppUser> pagedAppUsers = await _memberRepository.GetAllAsync(paginationParams, cancellationToken);

        if (pagedAppUsers.Count == 0) // []
            return NoContent();

        /*  1- Response only exists in Contoller. So we have to set PaginationHeader here before converting AppUser to UserDto.
        If we convert AppUser before here, we'll lose PagedList's pagination values, e.g. CurrentPage, PageSize, etc.
        */
        PaginationHeader paginationHeader = new(
            CurrentPage: pagedAppUsers.CurrentPage,
            ItemsPerPage: pagedAppUsers.PageSize,
            TotalItems: pagedAppUsers.TotalItems,
            TotalPages: pagedAppUsers.TotalPages
        );

        Response.AddPaginationHeader(paginationHeader);

        /*  2- PagedList<T> has to be AppUser first to retrieve data from DB and set pagination values. 
                After that step we can convert AppUser to MemberDto in here (NOT in the UserRepository) */

        List<MemberDto> memberDtos = [];

        foreach (AppUser appUser in pagedAppUsers)
        {
            memberDtos.Add(Mappers.ConvertAppUserToMemberDto(appUser));
        }

        return memberDtos;
    }

    [HttpGet("get-by-id/{memberId}")]
    public async Task<ActionResult<MemberDto>> GetById(string memberId, CancellationToken cancellationToken)
    {
        MemberDto? memberDto = await _memberRepository.GetByIdAsync(memberId, cancellationToken);

        if (memberDto is null)
            return NotFound("No user with this ID");

        return memberDto;
    }

    [HttpGet("get-by-email/{memberEmail}")]
    public async Task<ActionResult<MemberDto>> GetByEmail(string memberEmail, CancellationToken cancellationToken)
    {
        MemberDto? memberDto = await _memberRepository.GetByEmailAsync(memberEmail, cancellationToken);

        if (memberDto is null)
            return NotFound("No user with this email address");

        return memberDto;
    }
}
