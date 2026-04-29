using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Transaksi
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ItemBukuId { get; set; }

        public DateTime TanggalPinjam { get; set; }

        public DateTime BatasKembali { get; set; }

        // Bisa kosong (null) jika buku belum dikembalikan
        public DateTime? TanggalKembali { get; set; }

        // Status: "Berjalan", "Selesai", "Terlambat", "Hilang"
        public string StatusTransaksi { get; set; } = "Berjalan";
        // ini kita kasih denda klo ada yang telat balikkin buku 
        public int Denda { get; set; } = 0;
    }
}