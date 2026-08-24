using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IdentityService.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        private static readonly Guid AdminUserId = new Guid("00000000-0000-0000-0000-000000000001");

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Name", "Email", "PasswordHash", "Role", "CreatedAt" },
                values: new object[]
                {
                    AdminUserId,
                    "Admin",
                    "admin@gmail.com",
                    "$2a$11$3mSZNmhCnZDFR7k6Fb6y.Os3jfp15Djpj5KouPQ9xEHOALa8Nd0ae",
                    "Admin",
                    new DateTime(2026, 8, 24, 0, 0, 0, DateTimeKind.Utc)
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: AdminUserId);
        }
    }
}
