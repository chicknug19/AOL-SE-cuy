using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PerpusDbContext _context;

        public UserController(PerpusDbContext context)
        {
            _context = context;
        }

        // FUNGSI 1: Mendapatkan semua user (Biasanya dipakai Admin untuk melihat daftar member)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // FUNGSI 2: Mendapatkan profil user berdasarkan ID
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User tidak ditemukan.");
            }

            return user;
        }

        // FUNGSI 3: Mendapatkan profil user berdasarkan Email (Sangat vital untuk Login SSO)
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound("User dengan email tersebut tidak ditemukan.");
            }

            return user;
        }

        // FUNGSI 4: Mendaftarkan user baru (Bisa dipanggil Frontend jika user baru pertama kali login SSO)
        [HttpPost]
        public async Task<ActionResult<User>> TambahUser(User user)
        {
            // Default keamanan: pastikan yang daftar otomatis jadi Member, bukan Admin
            user.Role = "Member";
            user.IsBlacklisted = false;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // FUNGSI 5: Update data user (Fitur krusial bagi Admin untuk nge-Blacklist mahasiswa!)
        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest("ID User tidak cocok.");
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}