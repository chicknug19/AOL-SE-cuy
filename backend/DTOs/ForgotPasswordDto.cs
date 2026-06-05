namespace backend.DTOs
{
    public class ForgotPasswordDto
    {
        // Bisa berisi Email atau NIM
        public string Identifier { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}