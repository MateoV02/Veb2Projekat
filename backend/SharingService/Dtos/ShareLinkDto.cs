using System;
using SharingService.Models;

namespace SharingService.Dtos
{
    public class ShareLinkDto
    {
        public string Token { get; set; }

        public string ShareUrl { get; set; }

        public AccessType AccessType { get; set; }

        public string QrCodeBase64 { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
