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

        public DbSet<Activity> Activities { get; set; }

        public DbSet<ChecklistItem> ChecklistItems { get; set; }

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

            modelBuilder.Entity<Activity>(entity =>
            {
                entity.HasKey(a => a.Id);

                entity.Property(a => a.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(a => a.Location)
                    .HasMaxLength(200);

                entity.Property(a => a.Description)
                    .HasMaxLength(1000);

                entity.Property(a => a.EstimatedCost)
                    .HasColumnType("decimal(18,2)");

                entity.Property(a => a.Status)
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .IsRequired();

                entity.HasOne(a => a.TripPlan)
                    .WithMany(t => t.Activities)
                    .HasForeignKey(a => a.TripPlanId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(a => a.TripPlanId);
            });

            modelBuilder.Entity<ChecklistItem>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Text)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.HasOne(c => c.TripPlan)
                    .WithMany(t => t.ChecklistItems)
                    .HasForeignKey(c => c.TripPlanId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(c => c.TripPlanId);
            });
        }
    }
}
