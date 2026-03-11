using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class PerpusDbContext : DbContext
    {
        // Constructor wajib untuk menyambungkan ke konfigurasi database
        public PerpusDbContext(DbContextOptions<PerpusDbContext> options) : base(options)
        {
        }

        // Mendaftarkan model menjadi tabel di database
        public DbSet<User> Users { get; set; }
        public DbSet<Buku> Bukus { get; set; }
        public DbSet<ItemBuku> ItemBukus { get; set; }
        public DbSet<Transaksi> Transaksis { get; set; }
    }
}