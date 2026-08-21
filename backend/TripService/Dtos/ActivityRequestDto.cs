using System;
using System.ComponentModel.DataAnnotations;
using TripService.Models;

namespace TripService.Dtos
{
    public class ActivityRequestDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [Required]
        public DateTime DateTime { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Procijenjeni trošak ne može biti negativan.")]
        public decimal EstimatedCost { get; set; }

        [Required]
        public ActivityStatus Status { get; set; }
    }
}
