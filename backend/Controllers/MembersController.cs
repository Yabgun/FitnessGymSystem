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

        // Tüm üyeleri getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            var members = await _context.Members
                .Include(m => m.MemberClasses)
                    .ThenInclude(mc => mc.Class)
                        .ThenInclude(c => c.Instructor)
                .AsNoTracking()
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
                        .ThenInclude(c => c.Instructor)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);

            if (member == null)
            {
                return NotFound();
            }

            return member;
        }

        // Yeni üye ekle
        [HttpPost]
        public async Task<ActionResult<Member>> CreateMember([FromBody] MemberCreateModel model)
        {
            try
            {
                var member = new Member
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    DateOfBirth = model.DateOfBirth,
                    MemberClasses = new List<MemberClass>()
                };

                // Önce member'ı kaydet
                _context.Members.Add(member);
                await _context.SaveChangesAsync();

                // Sonra sınıf ilişkilerini ekle
                if (model.SelectedClasses != null && model.SelectedClasses.Any())
                {
                    foreach (var classId in model.SelectedClasses)
                    {
                        var memberClass = new MemberClass
                        {
                            MemberId = member.Id,
                            ClassId = classId
                        };
                        _context.MemberClasses.Add(memberClass);
                    }
                    await _context.SaveChangesAsync();
                }

                // Reload the member with all relationships
                var createdMember = await _context.Members
                    .Include(m => m.MemberClasses)
                        .ThenInclude(mc => mc.Class)
                            .ThenInclude(c => c.Instructor)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.Id == member.Id);

                if (createdMember == null)
                {
                    return StatusCode(500, new { message = "Üye oluşturuldu fakat yüklenemedi" });
                }

                return CreatedAtAction(nameof(GetMember), new { id = createdMember.Id }, createdMember);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Üye eklenirken bir hata oluştu", error = ex.Message });
            }
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

                // Mevcut s��nıf kayıtlarını güncelle
                if (existingMember.MemberClasses != null)
                {
                    _context.MemberClasses.RemoveRange(existingMember.MemberClasses);
                }

                if (member.MemberClasses != null)
                {
                    foreach (var memberClass in member.MemberClasses)
                    {
                        var newMemberClass = new MemberClass
                        {
                            MemberId = id,
                            ClassId = memberClass.ClassId
                        };
                        _context.MemberClasses.Add(newMemberClass);
                    }
                }

                await _context.SaveChangesAsync();

                // Güncellenmiş üyeyi ilişkili verilerle birlikte getir
                var updatedMember = await _context.Members
                    .Include(m => m.MemberClasses)
                        .ThenInclude(mc => mc.Class)
                            .ThenInclude(c => c.Instructor)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.Id == id);

                return Ok(updatedMember);
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

    public class MemberCreateModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<int> SelectedClasses { get; set; }
    }
}
