using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessGymSystem.Migrations
{
    /// <inheritdoc />
    public partial class FixMemberClassRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MemberId",
                table: "Classes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Classes_MemberId",
                table: "Classes",
                column: "MemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Members_MemberId",
                table: "Classes",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Members_MemberId",
                table: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Classes_MemberId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "MemberId",
                table: "Classes");
        }
    }
}
