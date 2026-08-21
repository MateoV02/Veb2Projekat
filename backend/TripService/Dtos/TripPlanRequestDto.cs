using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TripService.Dtos
{
    public class TripPlanRequestDto : IValidatableObject
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Budžet ne može biti negativan.")]
        public decimal Budget { get; set; }

        public string Notes { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (EndDate < StartDate)
            {
                yield return new ValidationResult(
                    "Krajnji datum ne može biti prije početnog datuma.",
                    new[] { nameof(EndDate) });
            }
        }
    }
}
