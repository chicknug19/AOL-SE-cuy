using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs; // Panggil namespace DTOs

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BukuController : ControllerBase
    {
        private readonly PerpusDbContext _context;

        public BukuController(PerpusDbContext context)
        {
            _context = context;
        }

        // GET: api/Buku (Mengembalikan DTO)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BukuReadDto>>> GetBuku()
        {
            return await _context.Bukus
                .Select(b => new BukuReadDto
                {
                    Id = b.Id,
                    Judul = b.Judul,
                    Pengarang = b.Pengarang,
                    TahunTerbit = b.TahunTerbit
                }).ToListAsync();
        }

        // POST: api/Buku (Menerima CreateDto, Mengembalikan ReadDto)
        [HttpPost]
        public async Task<ActionResult<BukuReadDto>> TambahBuku(BukuCreateUpdateDto dto)
        {
            // Map dari DTO ke Model Database
            var buku = new Buku
            {
                Judul = dto.Judul,
                Pengarang = dto.Pengarang,
                TahunTerbit = dto.TahunTerbit
            };

            _context.Bukus.Add(buku);
            await _context.SaveChangesAsync();

            // Map kembali ke ReadDto untuk respon yang aman
            var response = new BukuReadDto
            {
                Id = buku.Id,
                Judul = buku.Judul,
                Pengarang = buku.Pengarang,
                TahunTerbit = buku.TahunTerbit
            };

            return Ok(response);
        }
    }
}