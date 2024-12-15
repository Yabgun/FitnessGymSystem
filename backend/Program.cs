using Microsoft.EntityFrameworkCore;
using FitnessGymSystem.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// CORS politikası
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

// Controller'ları ekle
builder.Services.AddControllers();

// Swagger/OpenAPI yapılandırması
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database bağlantısı
var connectionString = "Server=localhost;Database=fitnessgym;User=root;Password=zxcASDqwe412586!=;";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS'u en başta kullan
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Sadece bu route yapılandırmasını kullan
app.MapControllers();

// Veritabanını otomatik migrate et
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate(); // Veritabanını güncelle
        Console.WriteLine("Veritabanı başarıyla güncellendi.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Veritabanı güncellenirken hata oluştu: {ex.Message}");
    }
}

app.Run();