using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TripService.Dtos
{
    public class DestinationRequestDto : IValidatableObject
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [Required]
        [MaxLength(200)]
        public string Location { get; set; }

        [Required]
        public DateTime ArrivalDate { get; set; }

        [Required]
        public DateTime DepartureDate { get; set; }

        public string Notes { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (DepartureDate < ArrivalDate)
            {
                yield return new ValidationResult(
                    "Datum odlaska ne može biti prije datuma dolaska.",
                    new[] { nameof(DepartureDate) });
            }
        }
    }
}
