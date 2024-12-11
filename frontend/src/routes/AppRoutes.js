import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import MembersList from '../components/members/MembersList';
import AddMember from '../components/members/AddMember';
import CategoriesList from '../components/categories/CategoriesList';
import AddCategory from '../components/categories/AddCategory';
import EditCategory from '../components/categories/EditCategory';
import ClassesList from '../components/classes/ClassesList';
import AddClass from '../components/classes/AddClass';
import InstructorsList from '../components/instructors/InstructorsList';
import AddInstructor from '../components/instructors/AddInstructor';
import EditInstructor from '../components/instructors/EditInstructor';
import Schedule from '../components/schedule/Schedule';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      
      {/* Üyeler */}
      <Route path="/members" element={<MembersList />} />
      <Route path="/members/add" element={<AddMember />} />
      
      {/* Kategoriler */}
      <Route path="/categories" element={<CategoriesList />} />
      <Route path="/categories/add" element={<AddCategory />} />
      <Route path="/categories/edit/:id" element={<EditCategory />} />
      
      {/* Sınıflar */}
      <Route path="/classes" element={<ClassesList />} />
      <Route path="/classes/add" element={<AddClass />} />
      
      {/* Eğitmenler */}
      <Route path="/instructors" element={<InstructorsList />} />
      <Route path="/instructors/add" element={<AddInstructor />} />
      <Route path="/instructors/edit/:id" element={<EditInstructor />} />
      
      {/* Program */}
      <Route path="/schedule" element={<Schedule />} />
      
      {/* 404 yönlendirmesi */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes; 