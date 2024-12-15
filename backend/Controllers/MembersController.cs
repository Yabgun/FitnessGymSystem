using Microsoft.AspNetCore.Mvc;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FitnessGymSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Şimdilik kaldırıyoruz
    public class MembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Tüm üyeleri getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            var members = await _context.Members
                .Include(m => m.MemberClasses)
                    .ThenInclude(mc => mc.Class)
                .ToListAsync();
            return Ok(members);
        }

        // Belirli bir üyeyi getir
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(int id)
        {
            var member = await _context.Members
                .Include(m => m.MemberClasses)
                    .ThenInclude(mc => mc.Class)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (member == null)
            {
                return NotFound();
            }

            return member;
        }

        // Yeni üye ekle
        [HttpPost]
        public async Task<ActionResult<Member>> CreateMember(Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, member);
        }

        // Üye güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] Member member)
        {
            try 
            {
                var existingMember = await _context.Members
                    .Include(m => m.MemberClasses)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (existingMember == null)
                {
                    return NotFound(new { message = "Üye bulunamadı" });
                }

                // Temel bilgileri güncelle
                existingMember.FirstName = member.FirstName;
                existingMember.LastName = member.LastName;
                existingMember.DateOfBirth = member.DateOfBirth;

                // Mevcut sınıf kayıtlarını güncelle
                if (existingMember.MemberClasses != null)
                {
                    _context.MemberClasses.RemoveRange(existingMember.MemberClasses);
                }

                if (member.MemberClasses != null)
                {
                    foreach (var memberClass in member.MemberClasses)
                    {
                        memberClass.MemberId = id;
                        _context.MemberClasses.Add(memberClass);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(existingMember);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Üye güncellenirken bir hata oluştu", error = ex.Message });
            }
        }

        // Üye sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _context.Members
                .Include(m => m.MemberClasses)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (member == null)
            {
                return NotFound();
            }

            _context.MemberClasses.RemoveRange(member.MemberClasses);
            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
