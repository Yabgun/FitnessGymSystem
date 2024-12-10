// Models/Instructor.cs
using System.Collections.Generic;

namespace FitnessGymSystem.Models
{
    public class Instructor
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Specialty { get; set; }

        public ICollection<Class> Classes { get; set; }
    }
}
