using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PerpusDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(PerpusDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login-sso")]
        public async Task<IActionResult> LoginSSO([FromBody] UserCreateDto request)
        {
            // 1. Validasi domain email otomatis berjalan dari DTO [UserCreateDto]

            // 2. Cari user di database, jika belum ada, otomatis daftarkan (Auto-Registration via SSO)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                user = new Models.User
                {
                    Nama = request.Nama,
                    Email = request.Email,
                    Role = "Member"
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            // 3. GENERATE JWT TOKEN
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Menyimpan klaim data identitas user di dalam token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role) // Menyimpan hak akses (Admin/Member)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1), // Token hangus dalam 1 hari
                signingCredentials: credentials);

            var jwtString = new JwtSecurityTokenHandler().WriteToken(token);

            // 4. Kembalikan token dan data user ke Frontend
            return Ok(new
            {
                Token = jwtString,
                User = user
            });
        }
    }
}