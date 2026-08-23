using ExpenseService.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseService.Data
{
    public class ExpenseDbContext : DbContext
    {
        public ExpenseDbContext(DbContextOptions<ExpenseDbContext> options)
            : base(options)
        {
        }

        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(e => e.Category)
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .IsRequired();

                entity.HasIndex(e => e.TripPlanId);
                entity.HasIndex(e => e.UserId);
            });
        }
    }
}
