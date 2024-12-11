import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Classes.css';

function AddClass() {
  const navigate = useNavigate();
  const [classData, setClassData] = useState({
    className: '',
    startTime: '',
    endTime: '',
    classCategoryId: '',
    instructorId: '',
    memberClasses: []
  });
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchInstructors();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/ClassCategories');
      setCategories(response.data);
    } catch (err) {
      setError('Kategoriler yüklenirken bir hata oluştu');
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('/api/Instructors');
      setInstructors(response.data);
    } catch (err) {
      setError('Eğitmenler yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/Classes', {
        ...classData,
        classCategoryId: parseInt(classData.classCategoryId),
        instructorId: parseInt(classData.instructorId),
        capacity: parseInt(classData.capacity)
      });
      navigate('/classes');
    } catch (err) {
      setError('Sınıf eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="class-form-container">
      <h2>Yeni Sınıf Ekle</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sınıf Adı</label>
          <input
            type="text"
            value={classData.className}
            onChange={(e) => setClassData({...classData, className: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Başlangıç Saati</label>
          <input
            type="time"
            value={classData.startTime}
            onChange={(e) => setClassData({...classData, startTime: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Bitiş Saati</label>
          <input
            type="time"
            value={classData.endTime}
            onChange={(e) => setClassData({...classData, endTime: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Kategori</label>
          <select
            value={classData.classCategoryId}
            onChange={(e) => setClassData({...classData, classCategoryId: e.target.value})}
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Eğitmen</label>
          <select
            value={classData.instructorId}
            onChange={(e) => setClassData({...classData, instructorId: e.target.value})}
            required
          >
            <option value="">Eğitmen Seçin</option>
            {instructors.map(instructor => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.firstName} {instructor.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/classes')} className="cancel-button">
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

export default AddClass; 