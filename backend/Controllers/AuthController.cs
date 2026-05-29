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

        // --- PINTU 1: LOGIN MAHASISWA (NIM + Password) ---
        [HttpPost("login-mahasiswa")]
        public async Task<IActionResult> LoginMahasiswa([FromBody] LoginMahasiswaDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.NIM == request.NIM && u.Role == "Member");

            // Cek apakah user ada dan password cocok
            if (user == null || user.Password != request.Password)
            {
                return Unauthorized("NIM atau Password salah!");
            }

            if (user.IsBlacklisted)
            {
                return BadRequest("Akun Anda di-blacklist.");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, User = user });
        }

        // --- PINTU 2: LOGIN ADMIN (Email + Password) ---
        [HttpPost("login-admin")]
        public async Task<IActionResult> LoginAdmin([FromBody] LoginAdminDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.Role == "Admin");

            if (user == null || user.Password != request.Password)
            {
                return Unauthorized("Email atau Password salah, atau Anda bukan Admin!");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, User = user });
        }

        // --- FUNGSI BANTUAN: Generate JWT (Dipisah agar kode lebih bersih) ---
        private string GenerateJwtToken(Models.User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                // Tambahkan NIM ke dalam token jika ada
                new Claim("NIM", user.NIM ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}