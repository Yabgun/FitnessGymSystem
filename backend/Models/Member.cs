// Models/Member.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Linq;

namespace FitnessGymSystem.Models
{
   public class Member
{
    public Member()
    {
        MemberClasses = new List<MemberClass>();
        FirstName = string.Empty;
        LastName = string.Empty;
    }

    public int Id { get; set; }

    [Required(ErrorMessage = "Ad zorunludur")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Soyad zorunludur")]
    public string LastName { get; set; }

    [Required(ErrorMessage = "Doğum tarihi zorunludur")]
    public DateTime DateOfBirth { get; set; }

    public virtual ICollection<MemberClass> MemberClasses { get; set; }

    [JsonIgnore]
    public ICollection<Class> Classes 
    { 
        get 
        {
            return MemberClasses?.Select(mc => mc.Class).ToList() ?? new List<Class>();
        }
    }
}


}
