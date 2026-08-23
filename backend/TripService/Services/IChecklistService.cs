using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TripService.Dtos;

namespace TripService.Services
{
    public interface IChecklistService
    {
        Task<IEnumerable<ChecklistItemDto>> GetAllForTripAsync(Guid userId, Guid tripId);

        Task<ChecklistItemDto> CreateAsync(Guid userId, Guid tripId, ChecklistItemRequestDto request);

        Task<ChecklistItemDto> UpdateAsync(Guid userId, Guid tripId, Guid itemId, ChecklistItemRequestDto request);

        Task<bool> DeleteAsync(Guid userId, Guid tripId, Guid itemId);
    }
}
