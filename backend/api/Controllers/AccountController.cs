
namespace api.Controllers;

[Authorize]
public class AccountController(IAccountRepository _accountRepository) : BaseApiController
{
    /// <summary>
    /// Create accounts
    /// Concurrency => async is used
    /// </summary>
    /// <param name="userInput"></param>
    /// <param name="cancellationToken"></param>
    /// <returns>LoggedInDto</returns>
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<LoggedInDto>> Register(RegisterDto userInput, CancellationToken cancellationToken) // parameter
    {
        if (userInput.Password != userInput.ConfirmPassword) // check if passwords match
            return BadRequest("Passwords don't match!"); // is it correct? What does it do?

        LoggedInDto? loggedInDto = await _accountRepository.CreateAsync(userInput, cancellationToken); // argument

        // // TODO teach AccountDto => LoggedInDto
        // if (!string.IsNullOrEmpty(loggedInDto.Token)) // success
        //     return Ok(loggedInDto);
        // else if (loggedInDto.Errors.Count != 0)
        //     return BadRequest(loggedInDto.Errors);
        // else
        //     return BadRequest("Registration has failed. . Try again or contact the support.");

        // BETTER CODE 
        return !string.IsNullOrEmpty(loggedInDto.Token) // success
            ? Ok(loggedInDto)
            : loggedInDto.Errors.Count != 0
            ? BadRequest(loggedInDto.Errors)
            : BadRequest("Registration has failed. Try again or contact the support.");
    }

    /// <summary>
    /// Login accounts
    /// </summary>
    /// <param name="userInput"></param>
    /// <param name="cancellationToken"></param>
    /// <returns>LoggedInDto</returns>
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoggedInDto>> Login(LoginDto userInput, CancellationToken cancellationToken)
    {
        LoggedInDto? loggedInDto = await _accountRepository.LoginAsync(userInput, cancellationToken);

        // TODO teach
        return !string.IsNullOrEmpty(loggedInDto.Token) // success
            ? Ok(loggedInDto)
            : loggedInDto.Errors.Count != 0
            ? BadRequest(loggedInDto.Errors)
            : BadRequest("Registration has failed. Try again or contact the support.");
    }

    // TODO replace this with AuthorizeLoggedInUser()
    [HttpGet]
    public async Task<ActionResult<LoggedInDto>> ReloadLoggedInUser(CancellationToken cancellationToken)
    {
        // obtain token value
        string? token = null;

        bool isTokenValid = HttpContext.Request.Headers.TryGetValue("Authorization", out var authHeader);

        if (isTokenValid)
            token = authHeader.ToString().Split(' ').Last();

        if (string.IsNullOrEmpty(token))
            return BadRequest("Token is expired or invalid. Login again.");

        // obtain userId
        string? userId = User.GetUserId();
        if (string.IsNullOrEmpty(userId))
            return BadRequest("No user was found with this user Id.");

        // get loggedInDto
        LoggedInDto? loggedInDto = await _accountRepository.ReloadLoggedInUserAsync(userId, token, cancellationToken);

        return loggedInDto is null ? Unauthorized("User is logged out or unauthorized. Login again.") : loggedInDto;
    }

    // [AllowAnonymous]
    // Reset Passsword

    // [Authorize]
    // Deactivate

    // [Authorize]
    // Delete
}
