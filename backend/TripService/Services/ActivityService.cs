using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Dtos;
using TripService.Models;

namespace TripService.Services
{
    public class ActivityService : IActivityService
    {
        private readonly TripDbContext _dbContext;
        private readonly IMapper _mapper;

        public ActivityService(TripDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ActivityDto>> GetAllForTripAsync(Guid userId, Guid tripId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var activities = await _dbContext.Activities
                .Where(a => a.TripPlanId == tripId)
                .OrderBy(a => a.DateTime)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ActivityDto>>(activities);
        }

        public async Task<ActivityDto> GetByIdAsync(Guid userId, Guid tripId, Guid activityId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var activity = await FindActivityAsync(tripId, activityId);
            return activity == null ? null : _mapper.Map<ActivityDto>(activity);
        }

        public async Task<ActivityDto> CreateAsync(Guid userId, Guid tripId, ActivityRequestDto request)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var activity = new Activity
            {
                Id = Guid.NewGuid(),
                TripPlanId = tripId,
                Name = request.Name,
                DateTime = request.DateTime,
                Location = request.Location,
                Description = request.Description,
                EstimatedCost = request.EstimatedCost,
                Status = request.Status,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Activities.Add(activity);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<ActivityDto>(activity);
        }

        public async Task<ActivityDto> UpdateAsync(Guid userId, Guid tripId, Guid activityId, ActivityRequestDto request)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var activity = await FindActivityAsync(tripId, activityId);
            if (activity == null)
            {
                return null;
            }

            activity.Name = request.Name;
            activity.DateTime = request.DateTime;
            activity.Location = request.Location;
            activity.Description = request.Description;
            activity.EstimatedCost = request.EstimatedCost;
            activity.Status = request.Status;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<ActivityDto>(activity);
        }

        public async Task<bool> DeleteAsync(Guid userId, Guid tripId, Guid activityId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return false;
            }

            var activity = await FindActivityAsync(tripId, activityId);
            if (activity == null)
            {
                return false;
            }

            _dbContext.Activities.Remove(activity);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private Task<bool> TripBelongsToUserAsync(Guid userId, Guid tripId)
        {
            return _dbContext.TripPlans.AnyAsync(t => t.Id == tripId && t.UserId == userId);
        }

        private Task<Activity> FindActivityAsync(Guid tripId, Guid activityId)
        {
            return _dbContext.Activities
                .FirstOrDefaultAsync(a => a.Id == activityId && a.TripPlanId == tripId);
        }
    }
}
