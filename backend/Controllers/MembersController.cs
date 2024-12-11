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
    [Authorize] // Tüm controller'ı yetkilendirme gerektirir
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
            // Giriş yapmış kullanıcının ID'sini almak için:
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var members = await _context.Members
                .Include(m => m.MemberClasses)
                .ThenInclude(mc => mc.Class)
                .ToListAsync();

            return Ok(members);
        }

        // Belirli bir üyeyi ID'ye göre getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(int id)
        {
            var member = await _context.Members
                .Include(m => m.MemberClasses)
                .ThenInclude(mc => mc.Class)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (member == null) 
                return NotFound(new { message = "Üye bulunamadı." });

            return Ok(member);
        }

        // Yeni üye oluştur
       [HttpPost]
public async Task<IActionResult> CreateMember([FromBody] Member member)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    // Gönderilen memberClasses içindeki sadece classId'yi kullanarak ilişkilendirme yap
    if (member.MemberClasses != null)
    {
        foreach (var memberClass in member.MemberClasses)
        {
            memberClass.Member = member; // Üye ile ilişkilendirme
            _context.MemberClasses.Add(memberClass);
        }
    }

    _context.Members.Add(member);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetMember), new { id = member.Id }, member);
}


        // Varolan bir üyeyi güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] Member updated)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return NotFound(new { message = "Üye bulunamadı." });

            // Alanları güncelle
            member.FirstName = updated.FirstName;
            member.LastName = updated.LastName;
            member.DateOfBirth = updated.DateOfBirth;

            await _context.SaveChangesAsync();
            return Ok(member);
        }

        // Bir üyeyi sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return NotFound(new { message = "Üye bulunamadı." });

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Üye başarıyla silindi." });
        }
    }
}
