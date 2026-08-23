using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace SharingService.Clients
{
    public class TripServiceClient : ITripServiceClient
    {
        private readonly HttpClient _httpClient;

        public TripServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<TripSummary> GetTripAsync(Guid tripId, string bearerToken)
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, $"trips/{tripId}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

            using var response = await _httpClient.SendAsync(request);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<TripSummary>();
        }
    }
}
