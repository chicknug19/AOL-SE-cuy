using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ItemBukuCreateDto
    {
        [Required(ErrorMessage = "BukuId wajib disertakan.")]
        public int BukuId { get; set; }

        [Required(ErrorMessage = "Kode Barcode wajib diisi.")]
        [StringLength(50, ErrorMessage = "Barcode terlalu panjang.")]
        public string KodeBarcode { get; set; } = string.Empty;
    }

    // BEST PRACTICE INDUSTRI: Menggabungkan info judul buku ke dalam item fisik
    // Supaya frontend tidak perlu menembak API berulang kali (mencegah beban request)
    public class ItemBukuReadDto
    {
        public int Id { get; set; }
        public int BukuId { get; set; }
        public string JudulBuku { get; set; } = string.Empty; // Hasil join dari tabel Buku
        public string KodeBarcode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}