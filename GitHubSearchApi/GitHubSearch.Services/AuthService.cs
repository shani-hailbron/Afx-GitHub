using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using GitHubSearch.Interfaces;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace GitHubSearch.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        public AuthService(IConfiguration config) { _config = config; }

        // Mock 
        private const string MockUsername = "user";
        private const string MockPassword = "1234";

        public Task<string?> AuthenticateAsync(string username, string password)
        {
            if (username == MockUsername && password == MockPassword)
            {
                var jwtSection = _config.GetSection("JwtSettings");
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Secret"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var claims = new[] {
                    new Claim(JwtRegisteredClaimNames.Sub, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Name, username)
};
                var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["ExpiresMinutes"]!)),
                signingCredentials: creds
                );
                var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);
                return Task.FromResult<string?>(tokenStr);
            }
            return Task.FromResult<string?>(null);
        }
    }
}
