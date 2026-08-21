using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TripService.Data
{
    /// <summary>
    /// Omogućava "dotnet ef" alatu da napravi DbContext u design-time-u,
    /// bez pokretanja Service Fabric runtime-a.
    /// </summary>
    public class TripDbContextFactory : IDesignTimeDbContextFactory<TripDbContext>
    {
        public TripDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TripDbContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("TripDb"));

            return new TripDbContext(optionsBuilder.Options);
        }
    }
}
