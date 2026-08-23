using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace ExpenseService.Data
{
    /// <summary>
    /// Omogućava "dotnet ef" alatu da napravi DbContext u design-time-u,
    /// bez pokretanja Service Fabric runtime-a.
    /// </summary>
    public class ExpenseDbContextFactory : IDesignTimeDbContextFactory<ExpenseDbContext>
    {
        public ExpenseDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ExpenseDbContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("ExpenseDb"));

            return new ExpenseDbContext(optionsBuilder.Options);
        }
    }
}
