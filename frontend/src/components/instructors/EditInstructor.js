import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Instructors.css';

function EditInstructor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [instructor, setInstructor] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    classes: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstructor();
  }, [id]);

  const fetchInstructor = async () => {
    try {
      const response = await axios.get(`/api/Instructors/${id}`);
      setInstructor(response.data);
    } catch (err) {
      setError('Eğitmen bilgileri yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/Instructors/${id}`, instructor);
      navigate('/instructors');
    } catch (err) {
      setError('Eğitmen güncellenirken bir hata oluştu');
    }
  };

  return (
    <div className="instructor-form-container">
      <h2>Eğitmen Düzenle</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ad</label>
          <input
            type="text"
            value={instructor.firstName}
            onChange={(e) => setInstructor({...instructor, firstName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Soyad</label>
          <input
            type="text"
            value={instructor.lastName}
            onChange={(e) => setInstructor({...instructor, lastName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Uzmanlık Alanı</label>
          <input
            type="text"
            value={instructor.specialty}
            onChange={(e) => setInstructor({...instructor, specialty: e.target.value})}
            required
          />
        </div>

        {instructor.classes && instructor.classes.length > 0 && (
          <div className="form-group">
            <label>Verdiği Dersler</label>
            <div className="classes-list">
              {instructor.classes.map(cls => (
                <div key={cls.id} className="class-item">
                  {cls.className}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/instructors')} className="cancel-button">
            İptal
          </button>
          <button type="submit" className="submit-button">
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditInstructor; 