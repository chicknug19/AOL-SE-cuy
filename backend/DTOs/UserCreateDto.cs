using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UserCreateDto
    {
        [Required(ErrorMessage = "Nama wajib diisi.")]
        public string Nama { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email wajib diisi.")]
        [EmailAddress(ErrorMessage = "Format email tidak valid.")]
        // VALIDASI INDUSTRI: Memastikan email berakhiran @binus.ac.id atau @binus.edu
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@(binus\.ac\.id|binus\.edu)$",
            ErrorMessage = "Pendaftaran hanya diperbolehkan menggunakan email resmi BINUS.")]
        public string Email { get; set; } = string.Empty;
    }
}