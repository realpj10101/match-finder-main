// Entity

using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace api.Models;


[CollectionName("users")]
public class AppUser : MongoIdentityUser<ObjectId>
{
    // TODO teach
    public string? IdentifierHash { get; init; }
    // public string? JtiValue { get; init; }
    public DateOnly DateOfBirth { get; init; }
    public string KnownAs { get; init; } = string.Empty;
    public DateTime LastActive { get; init; }
    public string Gender { get; init; } = string.Empty;
    public string? Introduction { get; init; }
    public string? LookingFor { get; init; }
    public string? Interests { get; init; }
    public string City { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
    public List<Photo> Photos { get; init; } = [];
    // public int FollowingsCount { get; init; }
    // public int FollowersCount { get; init; }
}

// public record AppUser(
//     [property: BsonId, BsonRepresentation(BsonType.ObjectId)] string? Id,
//     string Email,
//     byte[]? PasswordHash,
//     byte[]? PasswordSalt,
//     DateOnly DateOfBirth,
//     string KnownAs, //known as
//     DateTime Created,
//     DateTime LastActive,
//     string Gender, // Male, Female, Other,
//     string? Introduction,
//     string? LookingFor,
//     string? Interests,
//     string City,
//     string Country,
//     List<Photo> Photos
// );

/*
    {
        'id': '9017234908174365298'
        'email': 'a@a.com',
        'password': 'aaaaaaaa',
        ...
        'photos': [
            {
                'Url_64': 'url',
                'Url_128': 'url',
                'Url_512': 'url',
                'Url_1024': 'url',
                'IsMain': 'true'
            },
            {
                'Url_64': 'url',
                'Url_128': 'url',
                'Url_512': 'url',
                'Url_1024': 'url',
                'IsMain': 'false'
            },
        ],
    }
*/
