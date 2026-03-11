using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ItemBuku
    {
        [Key]
        public int Id { get; set; }

        // Ini adalah relasi ke tabel Buku utama
        public int BukuId { get; set; }

        // Ini kode unik/barcode untuk di-scan (misal: "B-001")
        public string KodeBarcode { get; set; } = string.Empty;

        // Status bisa berisi: "Tersedia", "Dipinjam", "Hilang"
        public string Status { get; set; } = "Tersedia";
    }
}