using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // FUNGSI BARU: Mendapatkan daftar member dengan statistik denda dan peminjaman
        [HttpGet("members-stats")]
        public async Task<ActionResult<IEnumerable<MemberReadDto>>> GetMembersWithStats()
        {
            var members = await _context.Users
                .Where(u => u.Role == "Member") // Hanya ambil yang role-nya Member
                .Select(u => new MemberReadDto
                {
                    Id = u.Id,
                    Nama = u.Nama,
                    Email = u.Email,
                    IsBlacklisted = u.IsBlacklisted,
                    // Hitung buku yang sedang dipinjam (Status = "Berjalan" atau "Terlambat")
                    ActiveBorrowedBooks = _context.Transaksis
                        .Count(t => t.UserId == u.Id && (t.StatusTransaksi == "Berjalan" || t.StatusTransaksi == "Terlambat")),
                    // Jumlahkan semua denda dari transaksi yang berstatus "Terlambat"
                    TotalFines = _context.Transaksis
                        .Where(t => t.UserId == u.Id && t.StatusTransaksi == "Terlambat")
                        .Sum(t => (int?)t.Denda) ?? 0 // Gunakan int? untuk menghindari error null jika tidak ada denda
                })
                .ToListAsync();

            return Ok(members);
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

        [HttpPost]
        public async Task<ActionResult<User>> TambahUser(UserCreateDto dto)
        {
            // Cek apakah email sudah terdaftar sebelumnya (Best Practice)
            var userExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (userExists)
            {
                return BadRequest("Email ini sudah terdaftar di sistem Bookugers.");
            }

            var user = new User
            {
                Nama = dto.Nama,
                Email = dto.Email,
                Role = "Member",
                IsBlacklisted = false
            };

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
                return BadRequest("User ID does not match.");
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

        // ========================================================
        // FUNGSI 6: TOGGLE BLACKLIST (Fitur Cepat untuk Tombol Admin)
        // ========================================================
        [HttpPut("toggle-blacklist/{id}")]
        public async Task<IActionResult> ToggleBlacklist(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User is not found.");
            }

            // Balikkan statusnya (Jika true jadi false, jika false jadi true)
            user.IsBlacklisted = !user.IsBlacklisted;

            await _context.SaveChangesAsync();

            // Kembalikan status terbaru ke frontend
            return Ok(new
            {
                Message = "The status has been updated.",
                IsBlacklisted = user.IsBlacklisted
            });
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}