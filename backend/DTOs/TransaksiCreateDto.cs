using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class TransaksiCreateDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int ItemBukuId { get; set; }
    }

    // Mengembalikan data sirkulasi yang informatif untuk Admin & Member Dashboard
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
    }
}