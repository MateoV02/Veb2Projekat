using System.ComponentModel.DataAnnotations;

namespace IdentityService.Dtos
{
    public class RegisterRequestDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
