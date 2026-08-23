using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace TripService.Clients
{
    public class SharingServiceClient : ISharingServiceClient
    {
        private readonly HttpClient _httpClient;

        public SharingServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<TokenValidation> ValidateAsync(string token)
        {
            using var response = await _httpClient.GetAsync($"sharing/validate/{token}");

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<TokenValidation>();
        }
    }
}
