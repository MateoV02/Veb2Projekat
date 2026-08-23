using AutoMapper;
using ExpenseService.Dtos;
using ExpenseService.Models;

namespace ExpenseService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Expense, ExpenseDto>();
        }
    }
}
