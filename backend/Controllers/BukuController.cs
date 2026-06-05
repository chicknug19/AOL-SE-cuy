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
                return NotFound("The book is not found.");
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

        // PUT: api/Buku/5 (Untuk Fitur Edit Buku di Admin Catalog)
        [HttpPut("{id}")]
        public async Task<IActionResult> EditBuku(int id, BukuCreateUpdateDto dto)
        {
            var buku = await _context.Bukus.FindAsync(id);

            if (buku == null)
            {
                return NotFound("The book is not found.");
            }

            // Perbarui data model berdasarkan DTO dari frontend
            buku.Judul = dto.Judul;
            buku.Pengarang = dto.Pengarang;
            buku.TahunTerbit = dto.TahunTerbit;
            buku.CoverUrl = dto.CoverUrl;
            buku.Deskripsi = dto.Deskripsi;
            buku.Isbn = dto.Isbn;
            buku.Kategori = dto.Kategori;

            await _context.SaveChangesAsync();

            return NoContent(); // Status 204: Berhasil tanpa mengembalikan konten body
        }

        // DELETE: api/Buku/5 (Untuk Fitur Hapus Buku di Admin Catalog)
        [HttpDelete("{id}")]
        public async Task<IActionResult> HapusBuku(int id)
        {
            var buku = await _context.Bukus.FindAsync(id);

            if (buku == null)
            {
                return NotFound("The book is not found.");
            }

            // Cek apakah ada salinan fisik (ItemBuku) yang terikat dengan buku ini
            var hasPhysicalItems = await _context.ItemBukus.AnyAsync(i => i.BukuId == id);
            if (hasPhysicalItems)
            {
                return BadRequest("The book cannot be deleted because it still has a physical copy in inventory.");
            }

            _context.Bukus.Remove(buku);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}