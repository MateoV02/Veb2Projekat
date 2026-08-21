using System;

namespace IdentityService.Dtos
{
    public class AuthResponseDto
    {
        public string Token { get; set; }

        public DateTime ExpiresAt { get; set; }

        public UserDto User { get; set; }
    }
}
