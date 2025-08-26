using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GitHubSearch.Interfaces
{
    public interface IGitHubService
    {
        Task<string> SearchRepositoriesAsync(string q);
    }
}
