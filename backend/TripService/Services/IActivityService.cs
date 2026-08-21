using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TripService.Dtos;

namespace TripService.Services
{
    public interface IActivityService
    {
        Task<IEnumerable<ActivityDto>> GetAllForTripAsync(Guid userId, Guid tripId);

        Task<ActivityDto> GetByIdAsync(Guid userId, Guid tripId, Guid activityId);

        Task<ActivityDto> CreateAsync(Guid userId, Guid tripId, ActivityRequestDto request);

        Task<ActivityDto> UpdateAsync(Guid userId, Guid tripId, Guid activityId, ActivityRequestDto request);

        Task<bool> DeleteAsync(Guid userId, Guid tripId, Guid activityId);
    }
}
