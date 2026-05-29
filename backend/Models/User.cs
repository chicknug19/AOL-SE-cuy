using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Nama { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // --- TAMBAHAN BARU ---
        // Nullable (?) karena Admin mungkin hanya punya Email, bukan NIM
        public string? NIM { get; set; }

        // Menyimpan password yang sudah di-hash (disandikan)
        public string Password { get; set; } = string.Empty;
        // ---------------------

        // Role bisa berisi "Admin" atau "Member"
        public string Role { get; set; } = "Member";

        // Jika true, user tidak bisa pinjam buku lagi
        public bool IsBlacklisted { get; set; } = false;
    }
}