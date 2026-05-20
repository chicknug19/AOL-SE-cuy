using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly PerpusDbContext _context;

        public DashboardController(PerpusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardDto>> GetDashboardStats()
        {
            // 1. Hitung total judul buku
            var totalBooks = await _context.Bukus.CountAsync();

            // 2. Hitung buku yang sedang dipinjam
            var borrowedBooks = await _context.Transaksis
                .Where(t => t.StatusTransaksi == "Berjalan")
                .CountAsync();

            // 3. Hitung member aktif (bukan admin dan tidak di-blacklist)
            var activeMembers = await _context.Users
                .Where(u => u.Role == "Member" && !u.IsBlacklisted)
                .CountAsync();

            // 4. Ambil 5 transaksi terbaru
            var recentTransactions = await (from t in _context.Transaksis
                                            join u in _context.Users on t.UserId equals u.Id
                                            join ib in _context.ItemBukus on t.ItemBukuId equals ib.Id
                                            join b in _context.Bukus on ib.BukuId equals b.Id
                                            orderby t.TanggalPinjam descending // Urutkan dari yang terbaru
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
                                                Denda = t.Denda
                                            })
                                            .Take(5) // Ambil 5 saja
                                            .ToListAsync();

            // 5. Bungkus semua data ke dalam DTO
            var dashboardData = new DashboardDto
            {
                TotalBooks = totalBooks,
                BorrowedBooks = borrowedBooks,
                ActiveMembers = activeMembers,
                RecentTransactions = recentTransactions
            };

            return Ok(dashboardData);
        }
    }
}