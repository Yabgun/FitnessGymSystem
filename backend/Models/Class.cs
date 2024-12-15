// Models/Class.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessGymSystem.Models
{
    public class Class
    {
        public int Id { get; set; }

        [Required]
        public string ClassName { get; set; }

        public string Description { get; set; }

        [Required]
        public string StartTime { get; set; }

        [Required]
        public string EndTime { get; set; }

        [Required]
        [Range(1, 50)]
        public int Capacity { get; set; }

        [Required]
        public DayOfWeek DayOfWeek { get; set; }

        public int ClassCategoryId { get; set; }
        [JsonIgnore]
        public virtual ClassCategory? ClassCategory { get; set; }

        public int InstructorId { get; set; }
        [JsonIgnore]
        public virtual Instructor? Instructor { get; set; }

        [JsonIgnore]
        public virtual ICollection<MemberClass>? MemberClasses { get; set; }
    }
}
