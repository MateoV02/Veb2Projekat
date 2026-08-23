using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SharingService.Dtos;
using SharingService.Models;

namespace SharingService.Services
{
    public interface ISharingLinkService
    {
        Task<ShareLinkDto> CreateAsync(Guid userId, string bearerToken, Guid tripId, AccessType accessType);

        Task<IEnumerable<ShareLinkDto>> GetAllForTripAsync(Guid userId, Guid tripId);

        Task<bool> RevokeAsync(Guid userId, string token);

        Task<TokenValidationDto> ValidateAsync(string token);
    }
}
