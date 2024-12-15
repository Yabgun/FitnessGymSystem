using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;

namespace FitnessGymSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InstructorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Instructors
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var instructors = await _context.Instructors.ToListAsync();
                return Ok(instructors);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                return StatusCode(500, new { message = "Eğitmenler yüklenirken bir hata oluştu" });
            }
        }

        // GET: api/Instructors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Instructor>> GetInstructor(int id)
        {
            var instructor = await _context.Instructors
                .Include(i => i.ClassCategory)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null)
            {
                return NotFound();
            }

            return instructor;
        }

        // POST: api/Instructors
        [HttpPost]
        public async Task<ActionResult<Instructor>> CreateInstructor([FromBody] Instructor instructor)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Kategori ID'si belirtildiyse, kategorinin varlığını kontrol et
                if (instructor.ClassCategoryId != 0)
                {
                    var category = await _context.ClassCategories.FindAsync(instructor.ClassCategoryId);
                    if (category == null)
                    {
                        return BadRequest("Belirtilen kategori bulunamadı.");
                    }
                }

                _context.Instructors.Add(instructor);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetInstructor), new { id = instructor.Id }, instructor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Eğitmen eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        // PUT: api/Instructors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInstructor(int id, [FromBody] Instructor instructor)
        {
            if (id != instructor.Id)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(instructor).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(instructor);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InstructorExists(id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        // DELETE: api/Instructors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstructor(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null)
            {
                return NotFound();
            }

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InstructorExists(int id)
        {
            return _context.Instructors.Any(e => e.Id == id);
        }
    }
}
