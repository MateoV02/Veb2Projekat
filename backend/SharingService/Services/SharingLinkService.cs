using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using QRCoder;
using SharingService.Clients;
using SharingService.Dtos;
using SharingService.Models;

namespace SharingService.Services
{
    public class SharingLinkService : ISharingLinkService
    {
        private const string DictionaryName = "shareTokens";

        private readonly IReliableStateManager _stateManager;
        private readonly ITripServiceClient _tripServiceClient;
        private readonly string _frontendBaseUrl;

        public SharingLinkService(
            IReliableStateManager stateManager,
            ITripServiceClient tripServiceClient,
            IConfiguration configuration)
        {
            _stateManager = stateManager;
            _tripServiceClient = tripServiceClient;
            _frontendBaseUrl = configuration["Frontend:BaseUrl"]?.TrimEnd('/');
        }

        public async Task<ShareLinkDto> CreateAsync(Guid userId, string bearerToken, Guid tripId, AccessType accessType)
        {
            var trip = await _tripServiceClient.GetTripAsync(tripId, bearerToken);
            if (trip == null)
            {
                return null;
            }

            var token = GenerateToken();
            var record = new ShareTokenRecord
            {
                TripPlanId = tripId,
                AccessType = accessType,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            var dictionary = await _stateManager.GetOrAddAsync<IReliableDictionary<string, ShareTokenRecord>>(DictionaryName);

            using (var tx = _stateManager.CreateTransaction())
            {
                await dictionary.SetAsync(tx, token, record);
                await tx.CommitAsync();
            }

            return ToDto(token, record);
        }

        public async Task<IEnumerable<ShareLinkDto>> GetAllForTripAsync(Guid userId, Guid tripId)
        {
            var dictionary = await _stateManager.GetOrAddAsync<IReliableDictionary<string, ShareTokenRecord>>(DictionaryName);
            var results = new List<ShareLinkDto>();

            using (var tx = _stateManager.CreateTransaction())
            {
                var enumerable = await dictionary.CreateEnumerableAsync(tx);
                using (var enumerator = enumerable.GetAsyncEnumerator())
                {
                    while (await enumerator.MoveNextAsync(CancellationToken.None))
                    {
                        var pair = enumerator.Current;
                        if (pair.Value.TripPlanId == tripId && pair.Value.CreatedByUserId == userId)
                        {
                            results.Add(ToDto(pair.Key, pair.Value));
                        }
                    }
                }
            }

            return results;
        }

        public async Task<bool> RevokeAsync(Guid userId, string token)
        {
            var dictionary = await _stateManager.GetOrAddAsync<IReliableDictionary<string, ShareTokenRecord>>(DictionaryName);

            using (var tx = _stateManager.CreateTransaction())
            {
                var existing = await dictionary.TryGetValueAsync(tx, token);
                if (!existing.HasValue || existing.Value.CreatedByUserId != userId)
                {
                    return false;
                }

                await dictionary.TryRemoveAsync(tx, token);
                await tx.CommitAsync();
                return true;
            }
        }

        public async Task<TokenValidationDto> ValidateAsync(string token)
        {
            var dictionary = await _stateManager.GetOrAddAsync<IReliableDictionary<string, ShareTokenRecord>>(DictionaryName);

            using (var tx = _stateManager.CreateTransaction())
            {
                var result = await dictionary.TryGetValueAsync(tx, token);
                if (!result.HasValue)
                {
                    return null;
                }

                return new TokenValidationDto
                {
                    TripPlanId = result.Value.TripPlanId,
                    AccessType = result.Value.AccessType
                };
            }
        }

        private ShareLinkDto ToDto(string token, ShareTokenRecord record)
        {
            var shareUrl = $"{_frontendBaseUrl}/shared/{token}";

            return new ShareLinkDto
            {
                Token = token,
                ShareUrl = shareUrl,
                AccessType = record.AccessType,
                QrCodeBase64 = GenerateQrCodeBase64(shareUrl),
                CreatedAt = record.CreatedAt
            };
        }

        private static string GenerateQrCodeBase64(string content)
        {
            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
            var pngQrCode = new PngByteQRCode(qrCodeData);
            var bytes = pngQrCode.GetGraphic(10);
            return Convert.ToBase64String(bytes);
        }

        private static string GenerateToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(24);
            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
        }
    }
}
