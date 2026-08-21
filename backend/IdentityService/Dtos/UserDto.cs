using System;
using IdentityService.Models;

namespace IdentityService.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public UserRole Role { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
