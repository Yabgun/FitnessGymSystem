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
    public class MemberClassesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MemberClassesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollMemberToClass([FromBody] MemberClass mc)
        {
            if (await _context.MemberClasses.AnyAsync(m => m.MemberId == mc.MemberId && m.ClassId == mc.ClassId))
            {
                return BadRequest("Üye zaten bu derse kayıtlı.");
            }

            _context.MemberClasses.Add(mc);
            await _context.SaveChangesAsync();
            return Ok("Kayıt başarılı");
        }

        [HttpGet("classes-by-member/{memberId}")]
        public async Task<IActionResult> GetClassesForMember(int memberId)
        {
            var classes = await _context.MemberClasses
                .Where(mc => mc.MemberId == memberId)
                .Include(mc => mc.Class)
                .ToListAsync();
            return Ok(classes);
        }

        [HttpGet("members-by-class/{classId}")]
        public async Task<IActionResult> GetMembersForClass(int classId)
        {
            var members = await _context.MemberClasses
                .Where(mc => mc.ClassId == classId)
                .Include(mc => mc.Member)
                .ToListAsync();
            return Ok(members);
        }
    }
}
