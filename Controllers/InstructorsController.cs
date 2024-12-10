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
    public class InstructorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InstructorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var instructors = await _context.Instructors.ToListAsync();
            return Ok(instructors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();
            return Ok(instructor);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Instructor instructor)
        {
            _context.Instructors.Add(instructor);
            await _context.SaveChangesAsync();
            return Ok(instructor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Instructor updated)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();

            instructor.FirstName = updated.FirstName;
            instructor.LastName = updated.LastName;
            instructor.Specialty = updated.Specialty;
            await _context.SaveChangesAsync();
            return Ok(instructor);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();
            return Ok("Silindi");
        }
    }
}
