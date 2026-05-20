namespace backend.DTOs
{
    public class DashboardDto
    {
        public int TotalBooks { get; set; }
        public int BorrowedBooks { get; set; }
        public int ActiveMembers { get; set; }
        public List<TransaksiReadDto> RecentTransactions { get; set; } = new List<TransaksiReadDto>();
    }
}