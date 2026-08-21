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

        public DbSet<Destination> Destinations { get; set; }

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

            modelBuilder.Entity<Destination>(entity =>
            {
                entity.HasKey(d => d.Id);

                entity.Property(d => d.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(d => d.Location)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.HasOne(d => d.TripPlan)
                    .WithMany(t => t.Destinations)
                    .HasForeignKey(d => d.TripPlanId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(d => d.TripPlanId);
            });
        }
    }
}
