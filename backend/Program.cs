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
            app.Run();
        }
    }
}