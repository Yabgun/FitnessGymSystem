using System.Text.Json.Serialization;

namespace FitnessGymSystem.Models
{
    // Bu ara tablo, Member ve Class arasında Many-to-Many ilişkiyi yönetir
    public class MemberClass
    {
        public int MemberId { get; set; }
        [JsonIgnore]
        public Member Member { get; set; }

        public int ClassId { get; set; }
        public Class Class { get; set; }
    }
}
