using System;
using System.Threading.Tasks;

namespace SharingService.Clients
{
    public interface ITripServiceClient
    {
        /// <summary>
        /// Vraća osnovne podatke o planu putovanja pozivom ka TripService.
        /// Vraća null ako plan ne postoji ili ne pripada korisniku čiji je token prosleđen.
        /// </summary>
        Task<TripSummary> GetTripAsync(Guid tripId, string bearerToken);
    }
}
