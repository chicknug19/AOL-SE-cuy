using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Nama { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // Role bisa berisi "Admin" atau "Member"
        public string Role { get; set; } = "Member";

        // Jika true, user tidak bisa pinjam buku lagi
        public bool IsBlacklisted { get; set; } = false;
    }
}