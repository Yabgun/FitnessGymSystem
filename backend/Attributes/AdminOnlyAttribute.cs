using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace FitnessGymSystem.Attributes
{
    public class AdminOnlyAttribute : TypeFilterAttribute
    {
        public AdminOnlyAttribute() : base(typeof(AdminOnlyFilter))
        {
        }

        private class AdminOnlyFilter : IAuthorizationFilter
        {
            public void OnAuthorization(AuthorizationFilterContext context)
            {
                var isAdmin = context.HttpContext.User.HasClaim(c => 
                    c.Type == "IsAdmin" && c.Value == "true");

                if (!isAdmin)
                {
                    context.Result = new StatusCodeResult(403);
                }
            }
        }
    }
} 