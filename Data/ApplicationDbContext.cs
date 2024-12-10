using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessGymSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<ClassCategory> ClassCategories { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<MemberClass> MemberClasses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Member - Class Many-to-Many ilişki yapılandırması
    modelBuilder.Entity<MemberClass>()
        .HasKey(mc => new { mc.MemberId, mc.ClassId });

    modelBuilder.Entity<Member>()
        .HasMany(m => m.MemberClasses)
        .WithOne(mc => mc.Member)
        .HasForeignKey(mc => mc.MemberId);

    modelBuilder.Entity<Class>()
        .HasMany(c => c.MemberClasses)
        .WithOne(mc => mc.Class)
        .HasForeignKey(mc => mc.ClassId);
}


    }
}
