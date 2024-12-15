using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessGymSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToClassCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "StartTime",
                table: "Classes",
                type: "time(6)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "EndTime",
                table: "Classes",
                type: "time(6)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Classes",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ClassCategories",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "ClassCategories");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartTime",
                table: "Classes",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time(6)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndTime",
                table: "Classes",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time(6)");
        }
    }
}
