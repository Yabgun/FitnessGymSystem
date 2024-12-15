import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function AddInstructor() {
  const [instructor, setInstructor] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    classCategoryId: null
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/ClassCategories');
        setCategories(response.data);
      } catch (err) {
        setError('Kategoriler yüklenirken hata oluştu');
        console.error('Error:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const instructorData = {
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        specialty: instructor.specialty,
        classCategoryId: instructor.classCategoryId ? parseInt(instructor.classCategoryId) : null
      };

      await axios.post('/api/Instructors', instructorData);
      navigate('/instructors');
    } catch (err) {
      setError('Eğitmen eklenirken bir hata oluştu');
      console.error('Error:', err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Yeni Eğitmen Ekle</h1>
      </div>

      <div className="form-container">
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

          <div className="form-group">
            <label>Uzmanlık Kategorisi</label>
            <select
              value={instructor.classCategoryId || ''}
              onChange={(e) => setInstructor({...instructor, classCategoryId: e.target.value})}
            >
              <option key="select-category" value="">Seçiniz</option>
              {categories && categories.map((cat, index) => (
                <option key={`cat-${cat.id || index}`} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary">
              Kaydet
            </button>
            <button 
              type="button" 
              className="button button-secondary"
              onClick={() => navigate('/instructors')}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInstructor; 