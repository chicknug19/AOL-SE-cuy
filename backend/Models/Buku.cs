using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Buku
    {
        [Key]
        public int Id { get; set; }

        public string Judul { get; set; } = string.Empty;

        public string Pengarang { get; set; } = string.Empty;

        public string TahunTerbit { get; set; } = string.Empty;
    }
}