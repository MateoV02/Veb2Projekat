using System.ComponentModel.DataAnnotations;

namespace TripService.Dtos
{
    public class ChecklistItemRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Text { get; set; }

        public bool IsCompleted { get; set; }
    }
}
