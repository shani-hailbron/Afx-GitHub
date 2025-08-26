using GitHubSearch.Core.Models;
using GitHubSearch.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GitHubSearchApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        public AuthController(IAuthService auth) { _auth = auth; }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _auth.AuthenticateAsync(dto.Username, dto.Password);
            if (token == null) return Unauthorized(new { error = "Invalid credentials" });
            return Ok(new { token });
        }
    }
}
