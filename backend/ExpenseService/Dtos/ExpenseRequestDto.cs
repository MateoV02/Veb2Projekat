using System;
using System.ComponentModel.DataAnnotations;
using ExpenseService.Models;

namespace ExpenseService.Dtos
{
    public class ExpenseRequestDto
    {
        [Required]
        public Guid TripPlanId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [Required]
        public ExpenseCategory Category { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Iznos mora biti veći od nule.")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
    }
}
