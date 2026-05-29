using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<PerpusDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // --- TAMBAHAN CORS START ---
            // Kita izinkan frontend React untuk mengakses API ini
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // Port standar React/Vite
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });
            // --- TAMBAHAN CORS END ---

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // if (app.Environment.IsDevelopment())
            // {
                app.UseSwagger();
                app.UseSwaggerUI();
            // }

            app.UseHttpsRedirection();

            // --- TAMBAHAN CORS PADA PIPELINE ---
            app.UseCors("AllowReactApp");

            app.UseAuthorization();
            app.MapControllers();

            // --- AUTO MIGRATION UNTUK AZURE ---
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<PerpusDbContext>();
                    context.Database.Migrate(); // Ini akan otomatis mengaplikasikan Add-Migration terbaru ke Azure!
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Terjadi kesalahan saat melakukan migrasi database.");
                }
            }


            app.Run();
        }
    }
}