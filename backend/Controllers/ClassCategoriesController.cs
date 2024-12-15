using Microsoft.AspNetCore.Mvc;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace FitnessGymSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClassCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.ClassCategories.ToListAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                return StatusCode(500, new { message = "Kategoriler yüklenirken bir hata oluştu" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _context.ClassCategories
                    .Include(c => c.Classes)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                    return NotFound(new { message = "Kategori bulunamadı" });

                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori yüklenirken bir hata oluştu", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClassCategory category)
        {
            try
            {
                if (category == null)
                    return BadRequest(new { message = "Geçersiz kategori verisi" });

                // Temel validasyonlar
                if (string.IsNullOrWhiteSpace(category.Name))
                    return BadRequest(new { message = "Kategori adı boş olamaz" });

                // Kategori adının formatını düzelt
                category.Name = Regex.Replace(category.Name.Trim(), @"\s+", " ");

                // Açıklama alanını düzelt
                if (category.Description != null)
                {
                    category.Description = category.Description.Trim();
                }

                // Aynı isimde kategori var mı kontrol et
                var existingCategory = await _context.ClassCategories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == category.Name.ToLower());

                if (existingCategory != null)
                    return BadRequest(new { message = "Bu isimde bir kategori zaten mevcut" });

                _context.ClassCategories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClassCategory updated)
        {
            try
            {
                if (updated == null)
                    return BadRequest(new { message = "Geçersiz kategori verisi" });

                var category = await _context.ClassCategories.FindAsync(id);
                if (category == null)
                    return NotFound(new { message = "Kategori bulunamadı" });

                if (string.IsNullOrWhiteSpace(updated.Name))
                    return BadRequest(new { message = "Kategori adı boş olamaz" });

                // Aynı isimde başka kategori var mı kontrol et
                var existingCategory = await _context.ClassCategories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == updated.Name.ToLower() && c.Id != id);

                if (existingCategory != null)
                    return BadRequest(new { message = "Bu isimde bir kategori zaten mevcut" });

                category.Name = Regex.Replace(updated.Name.Trim(), @"\s+", " ");
                category.Description = updated.Description?.Trim();

                await _context.SaveChangesAsync();
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori güncellenirken bir hata oluştu", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.ClassCategories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Kategori bulunamadı." });
                }

                // Direkt silme işlemini gerçekleştir
                _context.ClassCategories.Remove(category);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Kategori başarıyla silindi." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Silme hatası: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"İç hata: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { 
                    message = "Kategori silinirken bir hata oluştu.",
                    error = ex.Message
                });
            }
        }
    }
}
