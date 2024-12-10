using Microsoft.AspNetCore.Mvc;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

namespace FitnessGymSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<IActionResult> Register([FromBody] User userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
            {
                return BadRequest("Bu kullanıcı adı zaten alınmış.");
            }

            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.PasswordHash)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Kayıt başarılı");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginDto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.PasswordHash, user.PasswordHash))
            {
                return Unauthorized("Kullanıcı adı veya şifre hatalı.");
            }

            var token = CreateToken(user);
            return Ok(new { token });
        }

        private string CreateToken(User user)
        {
            var jwtSection = _configuration.GetSection("Jwt");
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(1);

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
