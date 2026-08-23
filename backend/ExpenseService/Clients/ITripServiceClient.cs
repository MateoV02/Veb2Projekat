using System;
using System.Threading.Tasks;

namespace ExpenseService.Clients
{
    public interface ITripServiceClient
    {
        /// <summary>
        /// Vraća osnovne podatke o planu putovanja (uključujući budžet) pozivom ka TripService.
        /// Vraća null ako plan ne postoji ili ne pripada korisniku čiji je token prosleđen (TripService vraća 404).
        /// </summary>
        Task<TripSummary> GetTripAsync(Guid tripId, string bearerToken);
    }
}
