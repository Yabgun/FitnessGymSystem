import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import axios from './services/axiosConfig';
import './App.css';

// Import all components
import MembersList from './components/members/MembersList';
import AddMember from './components/members/AddMember';
import CategoriesList from './components/categories/CategoriesList';
import AddCategory from './components/categories/AddCategory';
import EditCategory from './components/categories/EditCategory';
import ClassesList from './components/classes/ClassesList';
import AddClass from './components/classes/AddClass';
import InstructorsList from './components/instructors/InstructorsList';
import AddInstructor from './components/instructors/AddInstructor';
import EditInstructor from './components/instructors/EditInstructor';
import Schedule from './components/schedule/Schedule';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Navbar onLogout={handleLogout} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members" element={<MembersList />} />
              <Route path="/members/add" element={<AddMember />} />
              <Route path="/categories" element={<CategoriesList />} />
              <Route path="/categories/add" element={<AddCategory />} />
              <Route path="/categories/edit/:id" element={<EditCategory />} />
              <Route path="/classes" element={<ClassesList />} />
              <Route path="/classes/add" element={<AddClass />} />
              <Route path="/instructors" element={<InstructorsList />} />
              <Route path="/instructors/add" element={<AddInstructor />} />
              <Route path="/instructors/edit/:id" element={<EditInstructor />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
