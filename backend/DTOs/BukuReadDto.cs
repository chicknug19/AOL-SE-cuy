namespace backend.DTOs
{
    // Dipakai saat Backend mengirimkan daftar buku ke Frontend
    public class BukuReadDto
    {
        public int Id { get; set; }
        public string Judul { get; set; } = string.Empty;
        public string Pengarang { get; set; } = string.Empty;
        public string TahunTerbit { get; set; } = string.Empty;

        public string? CoverUrl { get; set; }
        public string? Deskripsi { get; set; }
        public string? Isbn { get; set; }
        public string? Kategori { get; set; }
    }
}