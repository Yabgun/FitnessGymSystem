// Models/ClassCategory.cs
using System.Collections.Generic;

namespace FitnessGymSystem.Models
{
   public class ClassCategory
{
    public int Id { get; set; }
    public string Name { get; set; }

    public ICollection<Class> Classes { get; set; }
}

}
