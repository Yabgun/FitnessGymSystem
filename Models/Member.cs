// Models/Member.cs
using System;
using System.Collections.Generic;

namespace FitnessGymSystem.Models
{
   public class Member
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public ICollection<MemberClass> MemberClasses { get; set; }
}


}
