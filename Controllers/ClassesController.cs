using Microsoft.AspNetCore.Mvc;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace FitnessGymSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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
            var classes = await _context.Classes
                .Include(c => c.ClassCategory) // Kategori bilgilerini getir
                .Include(c => c.Instructor)   // Eğitmen bilgilerini getir
                .ToListAsync();

            return Ok(classes);
        }

        // Belirli bir dersi ID ile getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cls = await _context.Classes
                .Include(c => c.ClassCategory)
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cls == null)
                return NotFound(new { message = "Ders bulunamadı." });

            return Ok(cls);
        }

        // Yeni bir ders oluştur
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Class cls)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Classes.Add(cls);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = cls.Id }, cls);
        }

        // Var olan bir dersi güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Class updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cls = await _context.Classes.FindAsync(id);
            if (cls == null)
                return NotFound(new { message = "Ders bulunamadı." });

            // Alanları güncelle
            cls.ClassName = updated.ClassName;
            cls.StartTime = updated.StartTime;
            cls.EndTime = updated.EndTime;
            cls.ClassCategoryId = updated.ClassCategoryId;
            cls.InstructorId = updated.InstructorId;

            await _context.SaveChangesAsync();

            return Ok(cls);
        }

        // Var olan bir dersi sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cls = await _context.Classes.FindAsync(id);
            if (cls == null)
                return NotFound(new { message = "Ders bulunamadı." });

            _context.Classes.Remove(cls);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ders başarıyla silindi." });
        }
    }
}
