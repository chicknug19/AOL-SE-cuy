using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BukuController : ControllerBase
    {
        private readonly PerpusDbContext _context;

        // Menyambungkan controller dengan database (DbContext)
        public BukuController(PerpusDbContext context)
        {
            _context = context;
        }

        // FUNGSI 1: Mengambil semua data buku (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Buku>>> GetBuku()
        {
            return await _context.Bukus.ToListAsync();
        }

        // FUNGSI 2: Menambahkan buku baru (POST)
        [HttpPost]
        public async Task<ActionResult<Buku>> TambahBuku(Buku buku)
        {
            _context.Bukus.Add(buku);
            await _context.SaveChangesAsync();

            return Ok(buku);
        }
    }
}