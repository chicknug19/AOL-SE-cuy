using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaksiController : ControllerBase
    {
        private readonly PerpusDbContext _context;

        public TransaksiController(PerpusDbContext context)
        {
            _context = context;
        }

        // FUNGSI 1: Mendapatkan semua riwayat transaksi (Untuk tabel di Admin Dashboard)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaksi>>> GetTransaksi()
        {
            return await _context.Transaksis.ToListAsync();
        }

        // FUNGSI 2: Mendapatkan transaksi milik 1 Mahasiswa (Untuk Member Dashboard)
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Transaksi>>> GetTransaksiByUser(int userId)
        {
            // Frontend React akan pakai ini untuk menampilkan daftar buku yang sedang dipinjam mahasiswa
            return await _context.Transaksis.Where(t => t.UserId == userId).ToListAsync();
        }

        // FUNGSI 3: PROSES PEMINJAMAN BUKU (Checkout)
        [HttpPost("pinjam")]
        public async Task<ActionResult> PinjamBuku([FromBody] PinjamRequest request)
        {
            // 1. Validasi Mahasiswa
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound("User tidak ditemukan.");
            if (user.IsBlacklisted) return BadRequest("Akses ditolak! Mahasiswa ini sedang di-blacklist.");

            // 2. Validasi Fisik Buku
            var itemBuku = await _context.ItemBukus.FindAsync(request.ItemBukuId);
            if (itemBuku == null) return NotFound("Buku fisik tidak ditemukan.");
            if (itemBuku.Status != "Tersedia") return BadRequest("Maaf, fisik buku ini sedang dipinjam atau hilang.");

            // 3. Catat Transaksi Baru
            var transaksi = new Transaksi
            {
                UserId = request.UserId,
                ItemBukuId = request.ItemBukuId,
                TanggalPinjam = DateTime.Now,
                // Buku wajib dikembalikan dalam 7 hari
                BatasKembali = DateTime.Now.AddDays(7),
                StatusTransaksi = "Berjalan",
                Denda = 0
            };

            // 4. Ubah status fisik buku menjadi dipinjam
            itemBuku.Status = "Dipinjam";

            _context.Transaksis.Add(transaksi);
            await _context.SaveChangesAsync();

            return Ok(transaksi);
        }

        // FUNGSI 4: PROSES PENGEMBALIAN BUKU (Scan Barcode Return)
        [HttpPost("kembali/{itemBukuId}")]
        public async Task<ActionResult> KembalikanBuku(int itemBukuId)
        {
            // 1. Cari transaksi peminjaman yang masih "Berjalan" untuk fisik buku ini
            var transaksi = await _context.Transaksis
                .FirstOrDefaultAsync(t => t.ItemBukuId == itemBukuId && t.StatusTransaksi == "Berjalan");

            if (transaksi == null) return BadRequest("Buku ini tidak sedang dipinjam oleh siapa pun.");

            // 2. Catat waktu saat buku di-scan kembali oleh Admin
            transaksi.TanggalKembali = DateTime.Now;

            // 3. KALKULASI DENDA OTOMATIS (Sesuai SRS: Rp 2000/hari)
            if (transaksi.TanggalKembali > transaksi.BatasKembali)
            {
                TimeSpan keterlambatan = transaksi.TanggalKembali.Value - transaksi.BatasKembali;
                int hariTelat = (int)Math.Ceiling(keterlambatan.TotalDays); // Pembulatan ke atas

                transaksi.Denda = hariTelat * 2000;
                transaksi.StatusTransaksi = "Terlambat";
            }
            else
            {
                transaksi.StatusTransaksi = "Selesai";
            }

            // 4. Ubah fisik buku kembali tersedia di rak
            var itemBuku = await _context.ItemBukus.FindAsync(itemBukuId);
            if (itemBuku != null)
            {
                itemBuku.Status = "Tersedia";
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Buku berhasil dikembalikan", Data = transaksi });
        }

        // FUNGSI 5: LUNASI DENDA (Sesuai dokumen SRS)
        [HttpPut("bayardenda/{id}")]
        public async Task<IActionResult> PelunasanDenda(int id)
        {
            var transaksi = await _context.Transaksis.FindAsync(id);
            if (transaksi == null) return NotFound("Transaksi tidak ditemukan.");

            transaksi.Denda = 0; // Denda di-nol-kan karena sudah dibayar ke Admin
            transaksi.StatusTransaksi = "Selesai";

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Denda berhasil dilunasi." });
        }
    }

    // Class tambahan kecil agar Frontend React gampang mengirim data JSON saat mau pinjam
    public class PinjamRequest
    {
        public int UserId { get; set; }
        public int ItemBukuId { get; set; }
    }
}