using AutoMapper;
using IdentityService.Dtos;
using IdentityService.Models;

namespace IdentityService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}
