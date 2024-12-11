import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Instructors.css';

function AddInstructor() {
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    classes: []
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/Instructors', instructor);
      navigate('/instructors');
    } catch (err) {
      setError('Eğitmen eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="instructor-form-container">
      <h2>Yeni Eğitmen Ekle</h2>
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

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/instructors')} className="cancel-button">
            İptal
          </button>
          <button type="submit" className="submit-button">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddInstructor; 