using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace IdentityService.Data
{
    /// <summary>
    /// Omogućava "dotnet ef" alatu da napravi DbContext u design-time-u,
    /// bez pokretanja Service Fabric runtime-a (Program.Main zahteva pravi Fabric kontekst).
    /// </summary>
    public class IdentityDbContextFactory : IDesignTimeDbContextFactory<IdentityDbContext>
    {
        public IdentityDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<IdentityDbContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("IdentityDb"));

            return new IdentityDbContext(optionsBuilder.Options);
        }
    }
}
