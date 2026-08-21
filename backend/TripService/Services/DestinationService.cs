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
    public class DestinationService : IDestinationService
    {
        private readonly TripDbContext _dbContext;
        private readonly IMapper _mapper;

        public DestinationService(TripDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DestinationDto>> GetAllForTripAsync(Guid userId, Guid tripId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var destinations = await _dbContext.Destinations
                .Where(d => d.TripPlanId == tripId)
                .OrderBy(d => d.ArrivalDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<DestinationDto>>(destinations);
        }

        public async Task<DestinationDto> GetByIdAsync(Guid userId, Guid tripId, Guid destinationId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var destination = await FindDestinationAsync(tripId, destinationId);
            return destination == null ? null : _mapper.Map<DestinationDto>(destination);
        }

        public async Task<DestinationDto> CreateAsync(Guid userId, Guid tripId, DestinationRequestDto request)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var destination = new Destination
            {
                Id = Guid.NewGuid(),
                TripPlanId = tripId,
                Name = request.Name,
                Location = request.Location,
                ArrivalDate = request.ArrivalDate,
                DepartureDate = request.DepartureDate,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Destinations.Add(destination);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<DestinationDto>(destination);
        }

        public async Task<DestinationDto> UpdateAsync(Guid userId, Guid tripId, Guid destinationId, DestinationRequestDto request)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return null;
            }

            var destination = await FindDestinationAsync(tripId, destinationId);
            if (destination == null)
            {
                return null;
            }

            destination.Name = request.Name;
            destination.Location = request.Location;
            destination.ArrivalDate = request.ArrivalDate;
            destination.DepartureDate = request.DepartureDate;
            destination.Notes = request.Notes;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<DestinationDto>(destination);
        }

        public async Task<bool> DeleteAsync(Guid userId, Guid tripId, Guid destinationId)
        {
            if (!await TripBelongsToUserAsync(userId, tripId))
            {
                return false;
            }

            var destination = await FindDestinationAsync(tripId, destinationId);
            if (destination == null)
            {
                return false;
            }

            _dbContext.Destinations.Remove(destination);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private Task<bool> TripBelongsToUserAsync(Guid userId, Guid tripId)
        {
            return _dbContext.TripPlans.AnyAsync(t => t.Id == tripId && t.UserId == userId);
        }

        private Task<Destination> FindDestinationAsync(Guid tripId, Guid destinationId)
        {
            return _dbContext.Destinations
                .FirstOrDefaultAsync(d => d.Id == destinationId && d.TripPlanId == tripId);
        }
    }
}
