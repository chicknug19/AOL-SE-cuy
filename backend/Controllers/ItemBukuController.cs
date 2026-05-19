using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemBukuController : ControllerBase
    {
        private readonly PerpusDbContext _context;

        public ItemBukuController(PerpusDbContext context)
        {
            _context = context;
        }

        // FUNGSI 1: Mengambil semua salinan fisik buku
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemBuku>>> GetItemBuku()
        {
            return await _context.ItemBukus.ToListAsync();
        }

        // FUNGSI 2: Mengambil salinan fisik berdasarkan ID Judul Buku (Untuk melihat stok 1 judul)
        [HttpGet("buku/{bukuId}")]
        public async Task<ActionResult<IEnumerable<ItemBuku>>> GetItemBukuByBukuId(int bukuId)
        {
            return await _context.ItemBukus.Where(i => i.BukuId == bukuId).ToListAsync();
        }

        // FUNGSI 3: Mengambil buku berdasarkan Barcode (Fitur Khusus Scanner Admin)
        [HttpGet("scan/{barcode}")]
        public async Task<ActionResult<ItemBuku>> GetItemBukuByBarcode(string barcode)
        {
            var itemBuku = await _context.ItemBukus.FirstOrDefaultAsync(i => i.KodeBarcode == barcode);

            if (itemBuku == null)
            {
                return NotFound("Buku dengan barcode tersebut tidak ditemukan.");
            }

            return itemBuku;
        }

        // FUNGSI 4: Menambahkan salinan fisik buku baru ke inventaris
        [HttpPost]
        public async Task<ActionResult<ItemBuku>> TambahItemBuku(ItemBuku itemBuku)
        {
            _context.ItemBukus.Add(itemBuku);
            await _context.SaveChangesAsync();

            return Ok(itemBuku);
        }

        // FUNGSI 5: Mengubah status buku fisik (misal: Admin mengubah status jadi "Rusak" atau "Hilang")
        [HttpPut("{id}")]
        public async Task<IActionResult> EditItemBuku(int id, ItemBuku itemBuku)
        {
            if (id != itemBuku.Id)
            {
                return BadRequest("ID tidak cocok.");
            }

            _context.Entry(itemBuku).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemBukuExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // FUNGSI 6: Menghapus salinan fisik dari sistem
        [HttpDelete("{id}")]
        public async Task<IActionResult> HapusItemBuku(int id)
        {
            var itemBuku = await _context.ItemBukus.FindAsync(id);
            if (itemBuku == null)
            {
                return NotFound();
            }

            _context.ItemBukus.Remove(itemBuku);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemBukuExists(int id)
        {
            return _context.ItemBukus.Any(e => e.Id == id);
        }
    }
}