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
    public class TripPlanService : ITripPlanService
    {
        private readonly TripDbContext _dbContext;
        private readonly IMapper _mapper;

        public TripPlanService(TripDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TripPlanDto>> GetAllForUserAsync(Guid userId)
        {
            var trips = await _dbContext.TripPlans
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.StartDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TripPlanDto>>(trips);
        }

        public async Task<TripPlanDto> GetByIdAsync(Guid userId, Guid tripId)
        {
            var trip = await FindOwnedTripAsync(userId, tripId);
            return trip == null ? null : _mapper.Map<TripPlanDto>(trip);
        }

        public async Task<TripPlanDto> GetByIdSharedAsync(Guid tripId)
        {
            var trip = await _dbContext.TripPlans.FirstOrDefaultAsync(t => t.Id == tripId);
            return trip == null ? null : _mapper.Map<TripPlanDto>(trip);
        }

        public async Task<TripPlanDto> UpdateSharedAsync(Guid tripId, TripPlanRequestDto request)
        {
            var trip = await _dbContext.TripPlans.FirstOrDefaultAsync(t => t.Id == tripId);
            if (trip == null)
            {
                return null;
            }

            trip.Name = request.Name;
            trip.Description = request.Description;
            trip.StartDate = request.StartDate;
            trip.EndDate = request.EndDate;
            trip.Budget = request.Budget;
            trip.Notes = request.Notes;
            trip.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<TripPlanDto>(trip);
        }

        public async Task<TripPlanDto> CreateAsync(Guid userId, TripPlanRequestDto request)
        {
            var trip = new TripPlan
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Budget = request.Budget,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.TripPlans.Add(trip);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<TripPlanDto>(trip);
        }

        public async Task<TripPlanDto> UpdateAsync(Guid userId, Guid tripId, TripPlanRequestDto request)
        {
            var trip = await FindOwnedTripAsync(userId, tripId);
            if (trip == null)
            {
                return null;
            }

            trip.Name = request.Name;
            trip.Description = request.Description;
            trip.StartDate = request.StartDate;
            trip.EndDate = request.EndDate;
            trip.Budget = request.Budget;
            trip.Notes = request.Notes;
            trip.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<TripPlanDto>(trip);
        }

        public async Task<bool> DeleteAsync(Guid userId, Guid tripId)
        {
            var trip = await FindOwnedTripAsync(userId, tripId);
            if (trip == null)
            {
                return false;
            }

            _dbContext.TripPlans.Remove(trip);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private Task<TripPlan> FindOwnedTripAsync(Guid userId, Guid tripId)
        {
            return _dbContext.TripPlans
                .FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
        }
    }
}
