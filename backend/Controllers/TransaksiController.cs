using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransaksiReadDto>>> GetTransaksi()
        {
            return await (from t in _context.Transaksis
                          join u in _context.Users on t.UserId equals u.Id
                          join ib in _context.ItemBukus on t.ItemBukuId equals ib.Id
                          join b in _context.Bukus on ib.BukuId equals b.Id
                          select new TransaksiReadDto
                          {
                              Id = t.Id,
                              UserId = t.UserId,
                              NamaUser = u.Nama,
                              ItemBukuId = t.ItemBukuId,
                              JudulBuku = b.Judul,
                              KodeBarcode = ib.KodeBarcode,
                              TanggalPinjam = t.TanggalPinjam,
                              BatasKembali = t.BatasKembali,
                              TanggalKembali = t.TanggalKembali,
                              StatusTransaksi = t.StatusTransaksi,
                              Denda = t.Denda,
                              CoverUrl = b.CoverUrl
                          }).ToListAsync();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TransaksiReadDto>>> GetTransaksiByUser(int userId)
        {
            return await (from t in _context.Transaksis
                          join u in _context.Users on t.UserId equals u.Id
                          join ib in _context.ItemBukus on t.ItemBukuId equals ib.Id
                          join b in _context.Bukus on ib.BukuId equals b.Id
                          where t.UserId == userId
                          select new TransaksiReadDto
                          {
                              Id = t.Id,
                              UserId = t.UserId,
                              NamaUser = u.Nama,
                              ItemBukuId = t.ItemBukuId,
                              JudulBuku = b.Judul,
                              KodeBarcode = ib.KodeBarcode,
                              TanggalPinjam = t.TanggalPinjam,
                              BatasKembali = t.BatasKembali,
                              TanggalKembali = t.TanggalKembali,
                              StatusTransaksi = t.StatusTransaksi,
                              Denda = t.Denda,
                              CoverUrl = b.CoverUrl
                          }).ToListAsync();
        }

        // ========================================================
        // FUNGSI 3: PROSES PEMINJAMAN BUKU (DILENGKAPI ROLLBACK)
        // ========================================================
        [HttpPost("pinjam")]
        public async Task<ActionResult> PinjamBuku([FromBody] TransaksiCreateDto dto)
        {
            // Validasi di luar transaksi (untuk menghemat resource database)
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return NotFound("User tidak ditemukan.");
            if (user.IsBlacklisted) return BadRequest("Akses ditolak! Mahasiswa di-blacklist.");

            var itemBuku = await _context.ItemBukus.FindAsync(dto.ItemBukuId);
            if (itemBuku == null) return NotFound("Buku fisik tidak ditemukan.");
            if (itemBuku.Status != "Tersedia") return BadRequest("Fisik buku sedang dipinjam.");

            // MEMULAI TRANSAKSI KEAMANAN
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var transaksi = new Transaksi
                {
                    UserId = dto.UserId,
                    ItemBukuId = dto.ItemBukuId,
                    TanggalPinjam = DateTime.Now,
                    BatasKembali = DateTime.Now.AddDays(7),
                    StatusTransaksi = "Berjalan",
                    Denda = 0
                };

                // Perubahan 1: Buku tidak ada di rak
                itemBuku.Status = "Dipinjam";

                // Perubahan 2: Masukkan history
                _context.Transaksis.Add(transaksi);

                await _context.SaveChangesAsync();

                // JIKA SEMUA BERHASIL, SIMPAN PERMANEN
                await transaction.CommitAsync();

                return Ok("Buku berhasil dipinjam.");
            }
            catch (Exception ex)
            {
                // JIKA ADA ERROR (PUTUS KONEKSI, DLL), KEMBALIKAN DATA SEPERTI SEMULA
                await transaction.RollbackAsync();

                // Opsional: Log error 'ex.Message' ke file text untuk admin
                return StatusCode(500, "Terjadi kesalahan internal server. Transaksi dibatalkan secara otomatis.");
            }
        }

        // ========================================================
        // FUNGSI 4: PROSES PENGEMBALIAN BUKU (DILENGKAPI ROLLBACK)
        // ========================================================
        [HttpPost("kembali/{itemBukuId}")]
        public async Task<ActionResult> KembalikanBuku(int itemBukuId)
        {
            var transaksi = await _context.Transaksis
                .FirstOrDefaultAsync(t => t.ItemBukuId == itemBukuId && t.StatusTransaksi == "Berjalan");

            if (transaksi == null) return BadRequest("Buku ini tidak sedang dipinjam oleh siapa pun.");

            var itemBuku = await _context.ItemBukus.FindAsync(itemBukuId);
            if (itemBuku == null) return NotFound("Buku fisik tidak ditemukan di sistem.");

            // MEMULAI TRANSAKSI KEAMANAN
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                transaksi.TanggalKembali = DateTime.Now;

                // KALKULASI DENDA OTOMATIS
                if (transaksi.TanggalKembali > transaksi.BatasKembali)
                {
                    TimeSpan keterlambatan = transaksi.TanggalKembali.Value - transaksi.BatasKembali;
                    int hariTelat = (int)Math.Ceiling(keterlambatan.TotalDays);

                    transaksi.Denda = hariTelat * 2000;
                    transaksi.StatusTransaksi = "Terlambat";
                }
                else
                {
                    transaksi.StatusTransaksi = "Selesai";
                }

                // Kembalikan buku ke rak
                itemBuku.Status = "Tersedia";

                await _context.SaveChangesAsync();

                // JIKA SEMUA BERHASIL, SIMPAN PERMANEN
                await transaction.CommitAsync();

                return Ok(new { Message = "Buku berhasil dikembalikan", Data = transaksi });
            }
            catch (Exception ex)
            {
                // JIKA ADA ERROR, KEMBALIKAN DATA SEPERTI SEMULA
                await transaction.RollbackAsync();
                return StatusCode(500, "Terjadi kesalahan internal server. Proses pengembalian dibatalkan.");
            }
        }

        // ========================================================
        // FUNGSI 5: LUNASI DENDA (DILENGKAPI ROLLBACK)
        // ========================================================
        [HttpPut("bayardenda/{id}")]
        public async Task<IActionResult> PelunasanDenda(int id)
        {
            var transaksi = await _context.Transaksis.FindAsync(id);
            if (transaksi == null) return NotFound("Transaksi tidak ditemukan.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                transaksi.Denda = 0;
                transaksi.StatusTransaksi = "Selesai";

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { Message = "Denda berhasil dilunasi." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Terjadi kesalahan internal. Pembayaran dibatalkan.");
            }
        }
    }

    // Class tambahan
    public class PinjamRequest
    {
        public int UserId { get; set; }
        public int ItemBukuId { get; set; }
    }
}