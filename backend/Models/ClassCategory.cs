// Models/ClassCategory.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FitnessGymSystem.Models
{
    public class ClassCategory
    {
        public ClassCategory()
        {
            Classes = new List<Class>();
        }

        public int Id { get; set; }

        [Required(ErrorMessage = "Kategori adı zorunludur")]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public virtual ICollection<Class> Classes { get; set; }
    }
}
