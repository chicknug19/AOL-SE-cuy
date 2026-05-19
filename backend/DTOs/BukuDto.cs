using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    // Dipakai saat Frontend mengirim data untuk tambah/edit buku
    public class BukuCreateUpdateDto
    {
        [Required(ErrorMessage = "Judul buku wajib diisi.")]
        [StringLength(200, ErrorMessage = "Judul tidak boleh lebih dari 200 karakter.")]
        public string Judul { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nama pengarang wajib diisi.")]
        public string Pengarang { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tahun terbit wajib diisi.")]
        [RegularExpression(@"^\d{4}$", ErrorMessage = "Tahun terbit harus berupa 4 digit angka.")]
        public string TahunTerbit { get; set; } = string.Empty;
    }

    // Dipakai saat Backend mengirimkan daftar buku ke Frontend
    public class BukuReadDto
    {
        public int Id { get; set; }
        public string Judul { get; set; } = string.Empty;
        public string Pengarang { get; set; } = string.Empty;
        public string TahunTerbit { get; set; } = string.Empty;
    }
}