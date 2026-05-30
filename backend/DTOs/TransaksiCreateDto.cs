using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class TransaksiCreateDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int ItemBukuId { get; set; }
    }

    
}