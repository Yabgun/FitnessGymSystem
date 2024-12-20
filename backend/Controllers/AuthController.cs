using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FitnessGymSystem.Models;
using FitnessGymSystem.Data;

namespace FitnessGymSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                {
                    return BadRequest(new { message = "Kullanıcı adı ve şifre gereklidir." });
                }

                if (_context.Users.Any(u => u.Username == model.Username))
                {
                    return BadRequest(new { message = "Bu kullanıcı adı zaten kullanılıyor." });
                }

                if (_context.Users.Any(u => u.Email == model.Email))
                {
                    return BadRequest(new { message = "Bu e-posta adresi zaten kullanılıyor." });
                }

                var user = new User
                {
                    Username = model.Username,
                    Password = model.Password,
                    Email = model.Email
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user.Username, false);
                return Ok(new { 
                    token = token,
                    username = user.Username,
                    email = user.Email,
                    isAdmin = false
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                {
                    return BadRequest("Kullanıcı adı ve şifre gereklidir.");
                }

                var adminEmail = _configuration["AdminCredentials:Email"];
                var adminPassword = _configuration["AdminCredentials:Password"];
                bool isAdmin = false;

                if (model.Username == adminEmail && model.Password == adminPassword)
                {
                    var token = GenerateJwtToken(adminEmail, true);
                    return Ok(new { 
                        token = token,
                        username = adminEmail,
                        email = adminEmail,
                        isAdmin = true
                    });
                }

                var user = _context.Users.FirstOrDefault(u => 
                    u.Username == model.Username && 
                    u.Password == model.Password);

                if (user == null)
                {
                    return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });
                }

                var userToken = GenerateJwtToken(user.Username, false);
                return Ok(new { 
                    token = userToken,
                    username = user.Username,
                    email = user.Email,
                    isAdmin = false
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        private string GenerateJwtToken(string username, bool isAdmin)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("IsAdmin", isAdmin.ToString().ToLower())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
