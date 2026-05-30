using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

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

        // GET: api/Buku (Mengembalikan DTO dengan lengkap)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BukuReadDto>>> GetBuku()
        {
            return await _context.Bukus
                .Select(b => new BukuReadDto
                {
                    Id = b.Id,
                    Judul = b.Judul,
                    Pengarang = b.Pengarang,
                    TahunTerbit = b.TahunTerbit,
                    CoverUrl = b.CoverUrl,    
                    Deskripsi = b.Deskripsi,  
                    Isbn = b.Isbn,            
                    Kategori = b.Kategori     
                }).ToListAsync();
        }

        // GET: api/Buku/5 (Untuk Halaman Book Detail Page)
        [HttpGet("{id}")]
        public async Task<ActionResult<BukuReadDto>> GetBukuById(int id)
        {
            var buku = await _context.Bukus.FindAsync(id);

            if (buku == null)
            {
                return NotFound("Buku tidak ditemukan.");
            }

            var response = new BukuReadDto
            {
                Id = buku.Id,
                Judul = buku.Judul,
                Pengarang = buku.Pengarang,
                TahunTerbit = buku.TahunTerbit,
                CoverUrl = buku.CoverUrl,
                Deskripsi = buku.Deskripsi,
                Isbn = buku.Isbn,
                Kategori = buku.Kategori
            };

            return Ok(response);
        }

        // POST: api/Buku (Menerima CreateDto, Mengembalikan ReadDto lengkap)
        [HttpPost]
        public async Task<ActionResult<BukuReadDto>> TambahBuku(BukuCreateUpdateDto dto)
        {
            // Map dari DTO ke Model Database
            var buku = new Buku
            {
                Judul = dto.Judul,
                Pengarang = dto.Pengarang,
                TahunTerbit = dto.TahunTerbit,
                CoverUrl = dto.CoverUrl,
                Deskripsi = dto.Deskripsi,
                Isbn = dto.Isbn,
                Kategori = dto.Kategori
            };

            _context.Bukus.Add(buku);
            await _context.SaveChangesAsync();

         
            var response = new BukuReadDto
            {
                Id = buku.Id,
                Judul = buku.Judul,
                Pengarang = buku.Pengarang,
                TahunTerbit = buku.TahunTerbit,
                CoverUrl = buku.CoverUrl,    
                Deskripsi = buku.Deskripsi,  
                Isbn = buku.Isbn,            
                Kategori = buku.Kategori 
            };

            return Ok(response);
        }
    }
}