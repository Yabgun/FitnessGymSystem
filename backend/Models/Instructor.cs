// Models/Instructor.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessGymSystem.Models
{
    public class Instructor
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Ad alanı zorunludur")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Soyad alanı zorunludur")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Uzmanlık alanı zorunludur")]
        public string Specialty { get; set; }

        public int? ClassCategoryId { get; set; }

        [ForeignKey("ClassCategoryId")]
        public ClassCategory? ClassCategory { get; set; }

        public ICollection<Class>? Classes { get; set; }
    }
}
