using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessGymSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            try
            {
                Database.CanConnect();
                Console.WriteLine("Veritabanı bağlantısı başarılı!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Veritabanı bağlantı hatası: {ex.Message}");
                throw;
            }
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<ClassCategory> ClassCategories { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<MemberClass> MemberClasses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User konfigürasyonu
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Member - Class ilişkisi (Many-to-Many)
            modelBuilder.Entity<MemberClass>()
                .HasKey(mc => new { mc.MemberId, mc.ClassId });

            modelBuilder.Entity<MemberClass>()
                .HasOne(mc => mc.Member)
                .WithMany(m => m.MemberClasses)
                .HasForeignKey(mc => mc.MemberId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MemberClass>()
                .HasOne(mc => mc.Class)
                .WithMany(c => c.MemberClasses)
                .HasForeignKey(mc => mc.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

            // ClassCategory - Class ilişkisi (One-to-Many)
            modelBuilder.Entity<Class>()
                .HasOne(c => c.ClassCategory)
                .WithMany(cc => cc.Classes)
                .HasForeignKey(c => c.ClassCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Instructor - Class ilişkisi (One-to-Many)
            modelBuilder.Entity<Class>()
                .HasOne(c => c.Instructor)
                .WithMany(i => i.Classes)
                .HasForeignKey(c => c.InstructorId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = "Server=localhost;Database=fitnessgym;User=root;Password=zxcASDqwe412586!=;AllowZeroDateTime=True;Convert Zero Datetime=True;CharSet=utf8mb4;";
                optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            }
            
            optionsBuilder.EnableSensitiveDataLogging();
        }
    }
}
