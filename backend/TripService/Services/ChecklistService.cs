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
    public class ChecklistService : IChecklistService
    {
        private readonly TripDbContext _dbContext;
        private readonly IMapper _mapper;

        public ChecklistService(TripDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ChecklistItemDto>> GetAllForTripAsync(Guid userId, Guid tripId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var items = await _dbContext.ChecklistItems
                .Where(c => c.TripPlanId == tripId)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ChecklistItemDto>>(items);
        }

        public async Task<ChecklistItemDto> CreateAsync(Guid userId, Guid tripId, ChecklistItemRequestDto request)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var item = new ChecklistItem
            {
                Id = Guid.NewGuid(),
                TripPlanId = tripId,
                Text = request.Text,
                IsCompleted = request.IsCompleted,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.ChecklistItems.Add(item);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<ChecklistItemDto>(item);
        }

        public async Task<ChecklistItemDto> UpdateAsync(Guid userId, Guid tripId, Guid itemId, ChecklistItemRequestDto request)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var item = await FindItemAsync(tripId, itemId);
            if (item == null)
            {
                return null;
            }

            item.Text = request.Text;
            item.IsCompleted = request.IsCompleted;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<ChecklistItemDto>(item);
        }

        public async Task<bool> DeleteAsync(Guid userId, Guid tripId, Guid itemId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return false;
            }

            var item = await FindItemAsync(tripId, itemId);
            if (item == null)
            {
                return false;
            }

            _dbContext.ChecklistItems.Remove(item);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private Task<bool> TripBelongsToUserAsync(Guid userId, Guid tripId)
        {
            return _dbContext.TripPlans.AnyAsync(t => t.Id == tripId && t.UserId == userId);
        }

        private Task<ChecklistItem> FindItemAsync(Guid tripId, Guid itemId)
        {
            return _dbContext.ChecklistItems
                .FirstOrDefaultAsync(c => c.Id == itemId && c.TripPlanId == tripId);
        }
    }
}
