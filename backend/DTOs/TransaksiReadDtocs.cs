namespace backend.DTOs
{
    public class TransaksiReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string NamaUser { get; set; } = string.Empty;
        public int ItemBukuId { get; set; }
        public string JudulBuku { get; set; } = string.Empty;
        public string KodeBarcode { get; set; } = string.Empty;
        public DateTime TanggalPinjam { get; set; }
        public DateTime BatasKembali { get; set; }
        public DateTime? TanggalKembali { get; set; }
        public string StatusTransaksi { get; set; } = string.Empty;
        public int Denda { get; set; }

        // --- INI WAJIB DITAMBAHKAN ---
        public string? CoverUrl { get; set; }
    }
}