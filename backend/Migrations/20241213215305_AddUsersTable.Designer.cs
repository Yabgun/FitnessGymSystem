﻿// <auto-generated />
using System;
using FitnessGymSystem.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FitnessGymSystem.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241213215305_AddUsersTable")]
    partial class AddUsersTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("FitnessGymSystem.Models.Class", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("Capacity")
                        .HasColumnType("int");

                    b.Property<int>("ClassCategoryId")
                        .HasColumnType("int");

                    b.Property<string>("ClassName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<TimeSpan>("EndTime")
                        .HasColumnType("time(6)");

                    b.Property<int>("InstructorId")
                        .HasColumnType("int");

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("time(6)");

                    b.HasKey("Id");

                    b.HasIndex("ClassCategoryId");

                    b.HasIndex("InstructorId");

                    b.ToTable("Classes");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.ClassCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.HasKey("Id");

                    b.ToTable("ClassCategories");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.Instructor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("ClassCategoryId")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Specialty")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("ClassCategoryId");

                    b.ToTable("Instructors");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.Member", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Members");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.MemberClass", b =>
                {
                    b.Property<int>("MemberId")
                        .HasColumnType("int");

                    b.Property<int>("ClassId")
                        .HasColumnType("int");

                    b.HasKey("MemberId", "ClassId");

                    b.HasIndex("ClassId");

                    b.ToTable("MemberClasses");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.Class", b =>
                {
                    b.HasOne("FitnessGymSystem.Models.ClassCategory", "ClassCategory")
                        .WithMany("Classes")
                        .HasForeignKey("ClassCategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("FitnessGymSystem.Models.Instructor", "Instructor")
                        .WithMany("Classes")
                        .HasForeignKey("InstructorId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("ClassCategory");

                    b.Navigation("Instructor");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.Instructor", b =>
                {
                    b.HasOne("FitnessGymSystem.Models.ClassCategory", "ClassCategory")
                        .WithMany()
                        .HasForeignKey("ClassCategoryId");

                    b.Navigation("ClassCategory");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.MemberClass", b =>
                {
                    b.HasOne("FitnessGymSystem.Models.Class", "Class")
                        .WithMany("MemberClasses")
                        .HasForeignKey("ClassId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FitnessGymSystem.Models.Member", "Member")
                        .WithMany("MemberClasses")
                        .HasForeignKey("MemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Class");

                    b.Navigation("Member");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.Class", b =>
                {
                    b.Navigation("MemberClasses");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.ClassCategory", b =>
                {
                    b.Navigation("Classes");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.Instructor", b =>
                {
                    b.Navigation("Classes");
                });

            modelBuilder.Entity("FitnessGymSystem.Models.Member", b =>
                {
                    b.Navigation("MemberClasses");
                });
#pragma warning restore 612, 618
        }
    }
}
