using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using IdentityService.Data;
using IdentityService.Dtos;
using IdentityService.Models;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Services
{
    public class UserService : IUserService
    {
        private readonly IdentityDbContext _dbContext;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IMapper _mapper;

        public UserService(IdentityDbContext dbContext, IJwtTokenService jwtTokenService, IMapper mapper)
        {
            _dbContext = dbContext;
            _jwtTokenService = jwtTokenService;
            _mapper = mapper;
        }

        public async Task<UserDto> RegisterAsync(RegisterRequestDto request)
        {
            var emailExists = await _dbContext.Users
                .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (emailExists)
            {
                throw new EmailAlreadyExistsException(request.Email);
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            var (token, expiresAt) = _jwtTokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<UserDto> GetByIdAsync(Guid id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _dbContext.Users.OrderBy(u => u.Name).ToListAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }
    }
}
