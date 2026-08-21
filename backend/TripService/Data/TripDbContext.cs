using Microsoft.EntityFrameworkCore;
using TripService.Models;

namespace TripService.Data
{
    public class TripDbContext : DbContext
    {
        public TripDbContext(DbContextOptions<TripDbContext> options)
            : base(options)
        {
        }

        public DbSet<TripPlan> TripPlans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TripPlan>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(t => t.Description)
                    .HasMaxLength(1000);

                entity.Property(t => t.Budget)
                    .HasColumnType("decimal(18,2)");

                entity.HasIndex(t => t.UserId);
            });
        }
    }
}
