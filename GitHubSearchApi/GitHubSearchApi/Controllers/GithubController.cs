using GitHubSearch.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GitHubSearchApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GithubController : ControllerBase
    {
        private readonly IGitHubService _git;
        public GithubController(IGitHubService git) { _git = git; }

        [HttpGet("search")]
        [Authorize]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return BadRequest("query is required");
            var json = await _git.SearchRepositoriesAsync(query);
            return Content(json, "application/json");
        }
    }
}
