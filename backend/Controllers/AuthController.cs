using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;

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

            if (user == null || user.Password != request.Password)
            {
                return Unauthorized("The NIM or Password is incorrect!");
            }

            if (user.IsBlacklisted)
            {
                return BadRequest("your account is blacklisted.");
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
                return Unauthorized("Email or Password is incorrect, or you are not an Admin!");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, User = user });
        }

        // --- FUNGSI 3: MINTA LINK RESET (Kirim Email via gmail) ---
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            // Bisa mencari berdasarkan Email (Admin) atau NIM (Mahasiswa)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Identifier || u.NIM == request.Identifier);

            if (user == null)
                return BadRequest("Email or NIM not found in the system.");

            // Generate Token Acak Sepanjang 64 Karakter
            user.ResetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            user.ResetTokenExpires = DateTime.Now.AddMinutes(15); // Token hangus dalam 15 menit

            await _context.SaveChangesAsync();

            try
            {
                // Mengambil konfigurasi dari appsettings / secrets / azure
                var senderEmail = _config["EmailSettings:SenderEmail"];
                var appPassword = _config["EmailSettings:AppPassword"];
                var smtpHost = _config["EmailSettings:SmtpHost"];
                var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"]);

                var smtpClient = new SmtpClient(smtpHost)
                {
                    Port = smtpPort,
                    Credentials = new NetworkCredential(senderEmail, appPassword),
                    EnableSsl = true,
                };

                var frontendResetUrl = _config["FrontendSettings:ResetUrl"];
                string resetLink = $"{frontendResetUrl}?token={user.ResetToken}";

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "Bookugers Library"),
                    Subject = "Password Reset Request",
                    Body = $@"
                        <h3>Password Reset Request</h3>
                        <p>Hello {user.Nama},</p>
                        <p>We've received a request to reset your Bookugers account password. Click the link below to create a new password:</p>
                        <a href='{resetLink}' style='display:inline-block; padding:10px 20px; background-color:#4F46E5; color:white; text-decoration:none; border-radius:5px;'>Reset Password</a>
                        <p>This link is only valid for 15 minutes.</p>
                        <p>If you never requested a password reset, please ignore this email.</p>
                    ",
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(user.Email);
                await smtpClient.SendMailAsync(mailMessage);

                return Ok("The password reset link has been successfully sent to the registered email.");
            }
            catch (Exception ex)
            {
                // Rollback token jika email gagal terkirim (misalnya karena salah password SMTP)
                user.ResetToken = null;
                user.ResetTokenExpires = null;
                await _context.SaveChangesAsync();

                return StatusCode(500, $"Failed to send email. Make sure your gmail settings are correct. Error: {ex.Message}");
            }
        }

        // --- FUNGSI 4: VERIFIKASI TOKEN & UBAH PASSWORD ---
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == request.Token);

            if (user == null || user.ResetTokenExpires < DateTime.Now)
            {
                return BadRequest("Token is invalid or expired.");
            }

            // Ubah password, lalu bersihkan token agar tidak bisa dipakai lagi
            user.Password = request.NewPassword;
            user.ResetToken = null;
            user.ResetTokenExpires = null;

            await _context.SaveChangesAsync();

            return Ok("Password updated successfully.");
        }

        // --- FUNGSI BANTUAN: Generate JWT ---
        private string GenerateJwtToken(Models.User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
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