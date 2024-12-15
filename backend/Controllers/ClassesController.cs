using Microsoft.AspNetCore.Mvc;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessGymSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClassesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Tüm dersleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var classes = await _context.Classes
                    .Include(c => c.ClassCategory)
                    .Include(c => c.Instructor)
                    .Select(c => new
                    {
                        c.Id,
                        c.ClassName,
                        c.Description,
                        StartTime = c.StartTime.AddHours(3),
                        EndTime = c.EndTime.AddHours(3),
                        c.Capacity,
                        c.DayOfWeek,
                        c.ClassCategoryId,
                        c.InstructorId,
                        ClassCategory = c.ClassCategory == null ? null : new { c.ClassCategory.Id, c.ClassCategory.Name },
                        Instructor = c.Instructor == null ? null : new { c.Instructor.Id, c.Instructor.FirstName, c.Instructor.LastName }
                    })
                    .ToListAsync();

                return Ok(classes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                return StatusCode(500, new { message = "Sınıflar yüklenirken bir hata oluştu" });
            }
        }

        // Belirli bir dersi ID ile getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cls = await _context.Classes
                .Include(c => c.ClassCategory)
                .Include(c => c.Instructor)
                .Include(c => c.MemberClasses)
                    .ThenInclude(mc => mc.Member)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cls == null)
                return NotFound(new { message = "Ders bulunamadı." });

            return Ok(cls);
        }

        // Yeni bir ders oluştur
        [HttpPost]
        public async Task<IActionResult> AddClass([FromBody] Class classModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz form verisi", errors = ModelState });
            }

            try
            {
                // Null kontrolü
                if (string.IsNullOrEmpty(classModel.ClassName))
                {
                    return BadRequest(new { message = "Sınıf adı boş olamaz." });
                }

                // Description null ise boş string ata
                classModel.Description = classModel.Description ?? "";

                // Kategori ve eğitmen kontrolü
                var category = await _context.ClassCategories.FindAsync(classModel.ClassCategoryId);
                var instructor = await _context.Instructors.FindAsync(classModel.InstructorId);

                if (category == null)
                {
                    return BadRequest(new { message = "Seçilen kategori bulunamadı." });
                }

                if (instructor == null)
                {
                    return BadRequest(new { message = "Seçilen eğitmen bulunamadı." });
                }

                try
                {
                    // StartTime ve EndTime'ı direkt olarak kaydet
                    classModel.StartTime = classModel.StartTime;
                    classModel.EndTime = classModel.EndTime;

                    // Navigation property'leri null olarak ayarla
                    classModel.ClassCategory = null;
                    classModel.Instructor = null;
                    classModel.MemberClasses = null;

                    // Veritabanına kaydet
                    _context.Classes.Add(classModel);
                    await _context.SaveChangesAsync();

                    // Yeni eklenen sınıfı döndür
                    var result = new
                    {
                        classModel.Id,
                        classModel.ClassName,
                        classModel.Description,
                        StartTime = classModel.StartTime.AddHours(3),
                        EndTime = classModel.EndTime.AddHours(3),
                        classModel.Capacity,
                        classModel.DayOfWeek,
                        classModel.ClassCategoryId,
                        classModel.InstructorId
                    };

                    return Ok(new { message = "Sınıf başarıyla eklendi", data = result });
                }
                catch (DbUpdateException dbEx)
                {
                    Console.WriteLine($"Veritabanı Hatası: {dbEx.Message}");
                    Console.WriteLine($"İç Hata: {dbEx.InnerException?.Message}");
                    return StatusCode(500, new { message = "Sınıf eklenirken bir hata oluştu", error = dbEx.InnerException?.Message ?? dbEx.Message });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Genel Hata: {ex.Message}");
                    Console.WriteLine($"İç Hata: {ex.InnerException?.Message}");
                    return StatusCode(500, new { message = "Sınıf eklenirken bir hata oluştu", error = ex.Message });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Genel Hata: {ex.Message}");
                Console.WriteLine($"İç Hata: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "Sınıf eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        // Var olan bir dersi güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClass(int id, [FromBody] Class updated)
        {
            if (id != updated.Id)
                return BadRequest(new { message = "ID'ler eşleşmiyor." });

            var cls = await _context.Classes
                .Include(c => c.MemberClasses)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cls == null)
                return NotFound(new { message = "Ders bulunamadı." });

            // Kapasite kontrolü - mevcut üye sayısından az olamaz
            if (updated.Capacity < cls.MemberClasses.Count)
                return BadRequest(new { message = "Yeni kapasite mevcut üye sayısından az olamaz." });

            // Saatleri direkt olarak kullan
            updated.StartTime = updated.StartTime;
            updated.EndTime = updated.EndTime;

            // Alanları güncelle
            cls.ClassName = updated.ClassName;
            cls.Description = updated.Description;
            cls.StartTime = updated.StartTime;
            cls.EndTime = updated.EndTime;
            cls.Capacity = updated.Capacity;
            cls.DayOfWeek = updated.DayOfWeek;
            cls.ClassCategoryId = updated.ClassCategoryId;
            cls.InstructorId = updated.InstructorId;

            await _context.SaveChangesAsync();

            // Güncellenmiş veriyi döndür
            var result = new
            {
                cls.Id,
                cls.ClassName,
                cls.Description,
                StartTime = cls.StartTime.AddHours(3), // Saat farkını düzelt
                EndTime = cls.EndTime.AddHours(3),     // Saat farkını düzelt
                cls.Capacity,
                cls.DayOfWeek,
                cls.ClassCategoryId,
                cls.InstructorId
            };

            return Ok(result);
        }

        // Var olan bir dersi sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            try
            {
                var classItem = await _context.Classes
                    .Include(c => c.MemberClasses)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (classItem == null)
                    return NotFound(new { message = "Sınıf bulunamadı." });

                // Önce ilişkili kayıtları sil
                if (classItem.MemberClasses != null && classItem.MemberClasses.Any())
                {
                    _context.MemberClasses.RemoveRange(classItem.MemberClasses);
                }

                _context.Classes.Remove(classItem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Sınıf başarıyla silindi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sınıf silinirken bir hata oluştu.", error = ex.Message });
            }
        }

        // Sınıfa üye ekle
        [HttpPost("{classId}/enroll/{memberId}")]
        public async Task<IActionResult> EnrollMember(int classId, int memberId)
        {
            var cls = await _context.Classes
                .Include(c => c.MemberClasses)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (cls == null)
                return NotFound(new { message = "Ders bulunamadı." });

            // Kapasite kontrolü
            if (cls.MemberClasses.Count >= cls.Capacity)
                return BadRequest(new { message = "Sınıf kapasitesi dolu." });

            // Üyenin zaten kayıtlı olup olmadığını kontrol et
            if (cls.MemberClasses.Any(mc => mc.MemberId == memberId))
                return BadRequest(new { message = "Üye zaten bu derse kayıtlı." });

            var memberClass = new MemberClass
            {
                ClassId = classId,
                MemberId = memberId
            };

            _context.MemberClasses.Add(memberClass);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Üye derse başarıyla kaydedildi." });
        }

        // Sınıftan üye çıkar
        [HttpDelete("{classId}/unenroll/{memberId}")]
        public async Task<IActionResult> UnenrollMember(int classId, int memberId)
        {
            var memberClass = await _context.MemberClasses
                .FirstOrDefaultAsync(mc => mc.ClassId == classId && mc.MemberId == memberId);

            if (memberClass == null)
                return NotFound(new { message = "Üye bu derse kayıtlı değil." });

            _context.MemberClasses.Remove(memberClass);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Üye dersten başarıyla çıkarıldı." });
        }
    }
}
