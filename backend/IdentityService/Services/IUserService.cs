using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IdentityService.Dtos;

namespace IdentityService.Services
{
    public interface IUserService
    {
        Task<UserDto> RegisterAsync(RegisterRequestDto request);

        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);

        Task<UserDto> GetByIdAsync(Guid id);

        Task<IEnumerable<UserDto>> GetAllAsync();
    }
}
