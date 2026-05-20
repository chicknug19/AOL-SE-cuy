namespace backend.DTOs
{
    public class MemberReadDto
    {
        public int Id { get; set; }
        public string Nama { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsBlacklisted { get; set; }
        public int ActiveBorrowedBooks { get; set; }
        public int TotalFines { get; set; }
    }
}