using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TripService.Dtos;

namespace TripService.Services
{
    public interface IDestinationService
    {
        Task<IEnumerable<DestinationDto>> GetAllForTripAsync(Guid userId, Guid tripId);

        Task<DestinationDto> GetByIdAsync(Guid userId, Guid tripId, Guid destinationId);

        Task<DestinationDto> CreateAsync(Guid userId, Guid tripId, DestinationRequestDto request);

        Task<DestinationDto> UpdateAsync(Guid userId, Guid tripId, Guid destinationId, DestinationRequestDto request);

        Task<bool> DeleteAsync(Guid userId, Guid tripId, Guid destinationId);
    }
}
