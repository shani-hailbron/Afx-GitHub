using GitHubSearch.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using GitHubSearch.Core.Configuration;

namespace GitHubSearch.Services
{

    public class GitHubService : IGitHubService
    {
        private readonly IHttpClientFactory _http;
        private readonly GitHubSettings _settings;

        public GitHubService(IHttpClientFactory http, IOptions<GitHubSettings> options)
        {
            _http = http;
            _settings = options.Value;
        }

        public async Task<string> SearchRepositoriesAsync(string q)
        {
            var client = _http.CreateClient("github");
            client.DefaultRequestHeaders.UserAgent.ParseAdd(_settings.UserAgent);

            var url = $"{_settings.Url}?q={Uri.EscapeDataString(q)}";
            var res = await client.GetAsync(url);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }
    }
}
