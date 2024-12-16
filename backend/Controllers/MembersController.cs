using Microsoft.AspNetCore.Mvc;
using FitnessGymSystem.Data;
using FitnessGymSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FitnessGymSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<MembersController> _logger;

        public MembersController(ApplicationDbContext context, ILogger<MembersController> logger)
        {
            _context = context;
            _logger = logger;
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
                _logger.LogInformation($"Creating member with data: FirstName={model.FirstName}, LastName={model.LastName}, DateOfBirth={model.DateOfBirth}");

                // Model validasyonu
                if (string.IsNullOrEmpty(model.FirstName) || string.IsNullOrEmpty(model.LastName))
                {
                    _logger.LogWarning("Invalid model data: FirstName or LastName is empty");
                    return BadRequest(new { message = "Ad ve soyad alanları zorunludur" });
                }

                var member = new Member
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    DateOfBirth = model.DateOfBirth,
                    MemberClasses = new List<MemberClass>()
                };

                try
                {
                    _context.Members.Add(member);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Member saved to database with ID: {member.Id}");
                }
                catch (Exception dbEx)
                {
                    _logger.LogError($"Database error while saving member: {dbEx.Message}");
                    return StatusCode(500, new { message = "Üye kaydedilirken veritabanı hatası oluştu", error = dbEx.Message });
                }

                if (model.SelectedClasses != null && model.SelectedClasses.Any())
                {
                    var memberClasses = new List<MemberClass>();
                    foreach (var classId in model.SelectedClasses)
                    {
                        try
                        {
                            var classEntity = await _context.Classes
                                .Include(c => c.Instructor)
                                .FirstOrDefaultAsync(c => c.Id == classId);

                            if (classEntity == null)
                            {
                                _logger.LogWarning($"Class with ID {classId} does not exist");
                                continue;
                            }

                            var memberClass = new MemberClass
                            {
                                MemberId = member.Id,
                                ClassId = classId,
                                Class = classEntity
                            };
                            memberClasses.Add(memberClass);
                        }
                        catch (Exception classEx)
                        {
                            _logger.LogError($"Error preparing class {classId} for member {member.Id}: {classEx.Message}");
                        }
                    }

                    try
                    {
                        await _context.MemberClasses.AddRangeAsync(memberClasses);
                        await _context.SaveChangesAsync();
                        _logger.LogInformation($"Added {memberClasses.Count} classes to member {member.Id}");
                    }
                    catch (Exception saveEx)
                    {
                        _logger.LogError($"Error saving member classes: {saveEx.Message}");
                    }
                }

                try
                {
                    var createdMember = await _context.Members
                        .Include(m => m.MemberClasses)
                            .ThenInclude(mc => mc.Class)
                                .ThenInclude(c => c.Instructor)
                        .FirstOrDefaultAsync(m => m.Id == member.Id);

                    if (createdMember == null)
                    {
                        _logger.LogError($"Member with ID {member.Id} not found after creation");
                        return StatusCode(500, new { message = "Üye oluşturuldu fakat yüklenemedi" });
                    }

                    _logger.LogInformation($"Successfully created member with ID: {member.Id}");
                    return CreatedAtAction(nameof(GetMember), new { id = createdMember.Id }, createdMember);
                }
                catch (Exception loadEx)
                {
                    _logger.LogError($"Error loading created member: {loadEx.Message}");
                    return StatusCode(500, new { message = "Üye oluşturuldu fakat detayları yüklenirken hata oluştu" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error in CreateMember: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Üye eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        // Üye güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] MemberUpdateModel model)
        {
            try 
            {
                var existingMember = await _context.Members
                    .Include(m => m.MemberClasses)
                        .ThenInclude(mc => mc.Class)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (existingMember == null)
                {
                    return NotFound(new { message = "Üye bulunamadı" });
                }

                // Temel bilgileri güncelle
                existingMember.FirstName = model.FirstName;
                existingMember.LastName = model.LastName;
                existingMember.DateOfBirth = model.DateOfBirth;

                // Mevcut sınıf kayıtlarını güncelle
                if (existingMember.MemberClasses != null)
                {
                    foreach (var mc in existingMember.MemberClasses.ToList())
                    {
                        _context.MemberClasses.Remove(mc);
                    }
                }

                if (model.SelectedClasses != null && model.SelectedClasses.Any())
                {
                    foreach (var classId in model.SelectedClasses)
                    {
                        var classEntity = await _context.Classes
                            .Include(c => c.Instructor)
                            .FirstOrDefaultAsync(c => c.Id == classId);

                        if (classEntity == null)
                        {
                            continue;
                        }

                        var memberClass = new MemberClass
                        {
                            MemberId = id,
                            ClassId = classId
                        };
                        _context.MemberClasses.Add(memberClass);
                    }
                }

                try
                {
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
                catch (Exception saveEx)
                {
                    _logger.LogError($"Error saving member updates: {saveEx.Message}");
                    return StatusCode(500, new { message = "Değişiklikler kaydedilirken hata oluştu", error = saveEx.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error in UpdateMember: {ex.Message}\nStackTrace: {ex.StackTrace}");
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

    public class MemberUpdateModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<int> SelectedClasses { get; set; }
    }
}
