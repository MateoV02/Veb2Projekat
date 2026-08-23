using AutoMapper;
using TripService.Dtos;
using TripService.Models;

namespace TripService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<TripPlan, TripPlanDto>();
            CreateMap<Destination, DestinationDto>();
            CreateMap<Activity, ActivityDto>();
            CreateMap<ChecklistItem, ChecklistItemDto>();
        }
    }
}
