// Models/Class.cs
using System;
using System.Collections.Generic;

namespace FitnessGymSystem.Models
{
    public class Class
{
    public int Id { get; set; }
    public string ClassName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    // ClassCategory ile ilişki
    public int ClassCategoryId { get; set; }
    public ClassCategory ClassCategory { get; set; }

    public int InstructorId { get; set; }
    public Instructor Instructor { get; set; }

    public ICollection<MemberClass> MemberClasses { get; set; }
}


}
