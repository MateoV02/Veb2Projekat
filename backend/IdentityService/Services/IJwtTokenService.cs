using System;
using IdentityService.Models;

namespace IdentityService.Services
{
    public interface IJwtTokenService
    {
        (string Token, DateTime ExpiresAt) GenerateToken(User user);
    }
}
