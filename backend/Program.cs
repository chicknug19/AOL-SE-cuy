using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // --- 1. SERVICE BAWAAN ASP.NET YANG SEMPAT TERHAPUS ---
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddAuthorization(); // <-- Ini yang akan memperbaiki error-mu!
            // ------------------------------------------------------

            // Konfigurasi Database
            builder.Services.AddDbContext<PerpusDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // --- 2. KONFIGURASI CORS (Disederhanakan) ---
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()   // Mengizinkan domain apapun (termasuk Vercel)
                          .AllowAnyMethod()   // Mengizinkan GET, POST, PUT, DELETE
                          .AllowAnyHeader();  // Mengizinkan semua jenis header
                });
            });
            // --------------------------------------------

            var app = builder.Build();

            // Selalu tampilkan Swagger untuk memudahkan testing
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            // Panggil CORS policy yang sudah dibuat
            app.UseCors("AllowAll");

            app.UseAuthorization();
            app.MapControllers();

            // --- 3. AUTO MIGRATION UNTUK AZURE ---
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<PerpusDbContext>();
                    context.Database.Migrate(); // Otomatis mengaplikasikan migrasi ke Azure
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Terjadi kesalahan saat melakukan migrasi database.");
                }
            }
            // -------------------------------------

            app.Run();
        }
    }
}