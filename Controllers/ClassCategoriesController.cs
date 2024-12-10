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
            var categories = await _context.ClassCategories.ToListAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.ClassCategories.FindAsync(id);
            if (category == null) return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClassCategory category)
        {
            _context.ClassCategories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClassCategory updated)
        {
            var category = await _context.ClassCategories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = updated.Name;
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.ClassCategories.FindAsync(id);
            if (category == null) return NotFound();

            _context.ClassCategories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok("Silindi");
        }
    }
}
