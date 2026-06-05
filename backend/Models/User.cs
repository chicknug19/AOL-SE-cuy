using System.ComponentModel.DataAnnotations;
using System;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Nama { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? NIM { get; set; }

        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Member";

        public bool IsBlacklisted { get; set; } = false;

        // --- TAMBAHAN BARU UNTUK FORGOT PASSWORD ---
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
    }
}