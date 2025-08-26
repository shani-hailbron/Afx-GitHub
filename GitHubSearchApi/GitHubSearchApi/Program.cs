using GitHubSearch.Core.Configuration;
using GitHubSearch.Interfaces;
using GitHubSearch.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddControllers();

// Cors - allow Angular dev server
const string CorsPolicy = "AllowClient";
builder.Services.AddCors(o => o.AddPolicy(CorsPolicy, p =>
    p.WithOrigins("http://localhost:4200")
     .AllowAnyHeader()
     .AllowAnyMethod()
));

// GitHub settings + HttpClient
builder.Services.Configure<GitHubSettings>(
    builder.Configuration.GetSection("GitHub"));

builder.Services.AddHttpClient("github");
builder.Services.AddScoped<IGitHubService, GitHubService>();

// DI services
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT
var jwt = config.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwt["Secret"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(CorsPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
