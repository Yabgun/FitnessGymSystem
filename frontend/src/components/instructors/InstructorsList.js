import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Instructors.css';

function InstructorsList() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('/api/Instructors');
      setInstructors(response.data);
      setLoading(false);
    } catch (err) {
      setError('Eğitmenler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Instructors/${id}`);
        fetchInstructors();
      } catch (err) {
        setError('Eğitmen silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="instructors-list-container">
      <div className="list-header">
        <h2>Eğitmenler</h2>
        <button onClick={() => navigate('/instructors/add')} className="add-button">
          Yeni Eğitmen
        </button>
      </div>

      <div className="instructors-grid">
        {instructors.map(instructor => (
          <div key={instructor.id} className="instructor-card">
            <div className="instructor-header">
              <h3>{instructor.firstName} {instructor.lastName}</h3>
              <span className="specialization-badge">
                {instructor.specialty}
              </span>
            </div>
            <div className="instructor-details">
              {instructor.classes && instructor.classes.length > 0 && (
                <div className="instructor-classes">
                  <strong>Verdiği Dersler:</strong>
                  <ul>
                    {instructor.classes.map(cls => (
                      <li key={cls.id}>{cls.className}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="card-actions">
              <button 
                onClick={() => navigate(`/instructors/edit/${instructor.id}`)}
                className="edit-button"
              >
                Düzenle
              </button>
              <button 
                onClick={() => handleDelete(instructor.id)}
                className="delete-button"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorsList; 