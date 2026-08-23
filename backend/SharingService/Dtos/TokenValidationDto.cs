using System;
using SharingService.Models;

namespace SharingService.Dtos
{
    public class TokenValidationDto
    {
        public Guid TripPlanId { get; set; }

        public AccessType AccessType { get; set; }
    }
}
