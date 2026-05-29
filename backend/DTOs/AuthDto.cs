using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    // DTO untuk Mahasiswa (Pintu 1)
    public class LoginMahasiswaDto
    {
        [Required(ErrorMessage = "NIM wajib diisi.")]
        public string NIM { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password wajib diisi.")]
        public string Password { get; set; } = string.Empty;
    }

    // DTO untuk Admin (Pintu 2)
    public class LoginAdminDto
    {
        [Required(ErrorMessage = "Email wajib diisi.")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password wajib diisi.")]
        public string Password { get; set; } = string.Empty;
    }
}