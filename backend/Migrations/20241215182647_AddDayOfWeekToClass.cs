﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessGymSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddDayOfWeekToClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DayOfWeek",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayOfWeek",
                table: "Classes");
        }
    }
}
