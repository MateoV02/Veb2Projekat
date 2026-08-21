using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TripService.Dtos;

namespace TripService.Services
{
    public interface ITripPlanService
    {
        Task<IEnumerable<TripPlanDto>> GetAllForUserAsync(Guid userId);

        Task<TripPlanDto> GetByIdAsync(Guid userId, Guid tripId);

        Task<TripPlanDto> CreateAsync(Guid userId, TripPlanRequestDto request);

        Task<TripPlanDto> UpdateAsync(Guid userId, Guid tripId, TripPlanRequestDto request);

        Task<bool> DeleteAsync(Guid userId, Guid tripId);
    }
}
