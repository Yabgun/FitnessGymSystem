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
                        c.StartTime,
                        c.EndTime,
                        c.Capacity,
                        c.DayOfWeek,
                        c.ClassCategoryId,
                        c.InstructorId,
                        Category = c.ClassCategory != null ? new { 
                            Id = c.ClassCategory.Id, 
                            Name = c.ClassCategory.Name 
                        } : null,
                        Instructor = c.Instructor != null ? new { 
                            Id = c.Instructor.Id, 
                            FirstName = c.Instructor.FirstName, 
                            LastName = c.Instructor.LastName 
                        } : null
                    })
                    .ToListAsync();

                return Ok(classes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Sınıflar yüklenirken bir hata oluştu", error = ex.Message });
            }
        }

        // Belirli bir dersi ID ile getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var cls = await _context.Classes
                    .Include(c => c.ClassCategory)
                    .Include(c => c.Instructor)
                    .Select(c => new
                    {
                        c.Id,
                        c.ClassName,
                        c.Description,
                        c.StartTime,
                        c.EndTime,
                        c.Capacity,
                        c.ClassCategoryId,
                        c.InstructorId,
                        Category = new { 
                            Id = c.ClassCategory.Id, 
                            Name = c.ClassCategory.Name 
                        },
                        Instructor = new { 
                            Id = c.Instructor.Id, 
                            FirstName = c.Instructor.FirstName, 
                            LastName = c.Instructor.LastName 
                        }
                    })
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (cls == null)
                    return NotFound(new { message = "Sınıf bulunamadı." });

                return Ok(cls);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sınıf yüklenirken bir hata oluştu", error = ex.Message });
            }
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
                // Saat formatını kontrol et
                if (string.IsNullOrEmpty(classModel.StartTime) || string.IsNullOrEmpty(classModel.EndTime))
                {
                    return BadRequest(new { message = "Başlangıç ve bitiş saatleri gereklidir." });
                }

                _context.Classes.Add(classModel);
                await _context.SaveChangesAsync();

                var result = new
                {
                    classModel.Id,
                    classModel.ClassName,
                    classModel.Description,
                    classModel.StartTime,
                    classModel.EndTime,
                    classModel.Capacity,
                    classModel.ClassCategoryId,
                    classModel.InstructorId
                };

                return Ok(new { message = "Sınıf başarıyla eklendi", data = result });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                return StatusCode(500, new { message = "Sınıf eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        // Var olan bir dersi güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Class updated)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz form verisi", errors = ModelState });
            }

            try
            {
                var cls = await _context.Classes
                    .Include(c => c.MemberClasses)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (cls == null)
                {
                    return NotFound(new { message = "Sınıf bulunamadı." });
                }

                // Saat formatını kontrol et
                if (string.IsNullOrEmpty(updated.StartTime) || string.IsNullOrEmpty(updated.EndTime))
                {
                    return BadRequest(new { message = "Başlangıç ve bitiş saatleri gereklidir." });
                }

                // Kapasite kontrolü
                if (updated.Capacity < (cls.MemberClasses?.Count ?? 0))
                {
                    return BadRequest(new { message = "Yeni kapasite mevcut üye sayısından az olamaz." });
                }

                // Eğitmen ve kategori kontrolü
                var instructor = await _context.Instructors.FindAsync(updated.InstructorId);
                var category = await _context.ClassCategories.FindAsync(updated.ClassCategoryId);

                if (instructor == null)
                {
                    return BadRequest(new { message = "Geçersiz eğitmen seçimi" });
                }

                if (category == null)
                {
                    return BadRequest(new { message = "Geçersiz kategori seçimi" });
                }

                // Alanları güncelle
                cls.ClassName = updated.ClassName;
                cls.Description = updated.Description;
                cls.StartTime = updated.StartTime;
                cls.EndTime = updated.EndTime;
                cls.Capacity = updated.Capacity;
                cls.ClassCategoryId = updated.ClassCategoryId;
                cls.InstructorId = updated.InstructorId;
                cls.DayOfWeek = updated.DayOfWeek;

                await _context.SaveChangesAsync();

                var result = new
                {
                    cls.Id,
                    cls.ClassName,
                    cls.Description,
                    cls.StartTime,
                    cls.EndTime,
                    cls.Capacity,
                    cls.ClassCategoryId,
                    cls.InstructorId,
                    cls.DayOfWeek,
                    Category = new { category.Id, category.Name },
                    Instructor = new { instructor.Id, instructor.FirstName, instructor.LastName }
                };

                return Ok(new { message = "Sınıf başarıyla güncellendi", data = result });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Güncelleme hatası: {ex.Message}");
                return StatusCode(500, new { message = "Sınıf güncellenirken bir hata oluştu", error = ex.Message });
            }
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
