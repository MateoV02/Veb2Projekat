using System.Threading.Tasks;

namespace TripService.Clients
{
    public interface ISharingServiceClient
    {
        /// <summary>
        /// Vraća podatke o share tokenu (kom planu pripada i koji je nivo pristupa),
        /// ili null ako token ne postoji/nije validan.
        /// </summary>
        Task<TokenValidation> ValidateAsync(string token);
    }
}
