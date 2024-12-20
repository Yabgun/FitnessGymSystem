using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace FitnessGymSystem.Models
{
    // Bu ara tablo, Member ve Class arasında Many-to-Many ilişkiyi yönetir
    public class MemberClass
    {
        [Required]
        public int MemberId { get; set; }
        [JsonIgnore]
        public virtual Member Member { get; set; }

        [Required]
        public int ClassId { get; set; }
        public virtual Class Class { get; set; }
    }
}
