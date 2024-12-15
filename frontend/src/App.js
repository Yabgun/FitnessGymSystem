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
import InstructorsList from './components/instructors/InstructorsList';
import AddInstructor from './components/instructors/AddInstructor';
import EditInstructor from './components/instructors/EditInstructor';
import Schedule from './components/schedule/Schedule';
import EditMember from './components/members/EditMember';
import EditClass from './components/classes/EditClass';

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
          {[
            {
              path: "/login",
              element: isAuthenticated ? <Navigate to="/" /> : <Auth onLoginSuccess={handleLoginSuccess} />,
              key: "login"
            },
            {
              path: "/",
              element: <ProtectedRoute><Dashboard user={user} /></ProtectedRoute>,
              key: "dashboard"
            },
            {
              path: "/members",
              element: <ProtectedRoute><MembersList /></ProtectedRoute>,
              key: "members"
            },
            {
              path: "/members/add",
              element: <ProtectedRoute><AddMember /></ProtectedRoute>,
              key: "add-member"
            },
            {
              path: "/members/edit/:id",
              element: <ProtectedRoute><EditMember /></ProtectedRoute>,
              key: "edit-member"
            },
            {
              path: "/categories",
              element: <ProtectedRoute><CategoriesList /></ProtectedRoute>,
              key: "categories"
            },
            {
              path: "/categories/add",
              element: <ProtectedRoute><AddCategory /></ProtectedRoute>,
              key: "add-category"
            },
            {
              path: "/categories/edit/:id",
              element: <ProtectedRoute><EditCategory /></ProtectedRoute>,
              key: "edit-category"
            },
            {
              path: "/classes",
              element: <ProtectedRoute><ClassesList /></ProtectedRoute>,
              key: "classes"
            },
            {
              path: "/classes/add",
              element: <ProtectedRoute><AddClass /></ProtectedRoute>,
              key: "add-class"
            },
            {
              path: "/classes/edit/:id",
              element: <ProtectedRoute><EditClass /></ProtectedRoute>,
              key: "edit-class"
            },
            {
              path: "/instructors",
              element: <ProtectedRoute><InstructorsList /></ProtectedRoute>,
              key: "instructors"
            },
            {
              path: "/instructors/add",
              element: <ProtectedRoute><AddInstructor /></ProtectedRoute>,
              key: "add-instructor"
            },
            {
              path: "/instructors/edit/:id",
              element: <ProtectedRoute><EditInstructor /></ProtectedRoute>,
              key: "edit-instructor"
            },
            {
              path: "/schedule",
              element: <ProtectedRoute><Schedule /></ProtectedRoute>,
              key: "schedule"
            },
            {
              path: "*",
              element: <Navigate to="/" replace />,
              key: "default"
            }
          ].map(route => (
            <Route
              key={route.key}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
