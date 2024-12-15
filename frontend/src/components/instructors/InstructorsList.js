import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('/api/Instructors');
      setInstructors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Instructors/${id}`);
        fetchInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Eğitmenler</h1>
        <button 
          className="button button-primary"
          onClick={() => navigate('/instructors/add')}
        >
          <i className="fas fa-plus"></i> Yeni Eğitmen Ekle
        </button>
      </div>

      <div className="grid-container">
        {instructors.map(instructor => (
          <div key={instructor.id} className="card">
            <h2>{instructor.firstName} {instructor.lastName}</h2>
            <div className="instructor-details">
              <p><strong>Uzmanlık:</strong> {instructor.specialty}</p>
              <p><strong>Kategori:</strong> {instructor.categoryName || 'Belirtilmemiş'}</p>
            </div>
            <div className="card-actions">
              <button 
                className="button button-secondary"
                onClick={() => navigate(`/instructors/edit/${instructor.id}`)}
              >
                <i className="fas fa-edit"></i> Düzenle
              </button>
              <button 
                className="button button-danger"
                onClick={() => handleDelete(instructor.id)}
              >
                <i className="fas fa-trash"></i> Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorsList; 