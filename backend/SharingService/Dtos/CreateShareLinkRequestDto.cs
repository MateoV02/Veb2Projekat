using System.ComponentModel.DataAnnotations;
using SharingService.Models;

namespace SharingService.Dtos
{
    public class CreateShareLinkRequestDto
    {
        [Required]
        public AccessType AccessType { get; set; }
    }
}
