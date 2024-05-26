public record MemberDto(
    // string Schema,
    string Id,
    int Age,
    string Email,
    string KnownAs,
    DateTime LastActive,
    DateTime Created,
    string Gender,
    string? Introduction,
    string? LookingFor,
    string? Interests,
    string City,
    string Country,
    List<Photo> Photos
);
