import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/auth/Auth';
import Dashboard from './components/Dashboard';
import './App.css';

// Import all components
import MembersList from './components/members/MembersList';
import AddMember from './components/members/AddMember';
import CategoriesList from './components/categories/CategoriesList';
import AddCategory from './components/categories/AddCategory';
import EditCategory from './components/categories/EditCategory';
import ClassesList from './components/classes/ClassesList';
import AddClass from './components/classes/AddClass';
import EditClass from './components/classes/EditClass';
import InstructorsList from './components/instructors/InstructorsList';
import AddInstructor from './components/instructors/AddInstructor';
import EditInstructor from './components/instructors/EditInstructor';
import Schedule from './components/schedule/Schedule';
import EditMember from './components/members/EditMember';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('user');
    setIsAuthenticated(true);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Korumalı route bileşeni
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" /> : 
                <Auth onLoginSuccess={handleLoginSuccess} />
            } 
          />

          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />

          {/* Korumalı rotalar */}
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <MembersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/add"
            element={
              <ProtectedRoute>
                <AddMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/edit/:id"
            element={
              <ProtectedRoute>
                <EditMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/add"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/edit/:id"
            element={
              <ProtectedRoute>
                <EditCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <ClassesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/add"
            element={
              <ProtectedRoute>
                <AddClass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/edit/:id"
            element={
              <ProtectedRoute>
                <EditClass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructors"
            element={
              <ProtectedRoute>
                <InstructorsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructors/add"
            element={
              <ProtectedRoute>
                <AddInstructor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructors/edit/:id"
            element={
              <ProtectedRoute>
                <EditInstructor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
