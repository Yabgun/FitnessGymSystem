using Microsoft.AspNetCore.Mvc;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessGymSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var members = await _context.Members
                    .Select(m => new
                    {
                        id = m.Id,
                        firstName = m.FirstName,
                        lastName = m.LastName,
                        email = m.Email,
                        phone = m.Phone,
                        address = m.Address
                    })
                    .ToListAsync();

                return Ok(members);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                return StatusCode(500, new { message = "Üyeler yüklenirken bir hata oluştu" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var member = await _context.Members
                .Include(m => m.MemberClasses)
                    .ThenInclude(mc => mc.Class)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (member == null)
            {
                return NotFound(new { message = "Üye bulunamadı" });
            }

            return Ok(member);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Members.Add(member);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = member.Id }, member);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Üye eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Member member)
        {
            if (id != member.Id)
            {
                return BadRequest(new { message = "ID'ler eşleşmiyor" });
            }

            try
            {
                var existingMember = await _context.Members.FindAsync(id);
                if (existingMember == null)
                {
                    return NotFound(new { message = "Üye bulunamadı" });
                }

                existingMember.FirstName = member.FirstName;
                existingMember.LastName = member.LastName;
                existingMember.Email = member.Email;
                existingMember.Phone = member.Phone;
                existingMember.Address = member.Address;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Üye başarıyla güncellendi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Üye güncellenirken bir hata oluştu", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var member = await _context.Members
                    .Include(m => m.MemberClasses)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (member == null)
                {
                    return NotFound(new { message = "Üye bulunamadı" });
                }

                if (member.MemberClasses?.Any() == true)
                {
                    _context.MemberClasses.RemoveRange(member.MemberClasses);
                }

                _context.Members.Remove(member);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Üye başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Üye silinirken bir hata oluştu", error = ex.Message });
            }
        }
    }
}
