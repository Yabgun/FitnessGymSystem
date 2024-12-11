import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Categories.css';

function AddCategory() {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/ClassCategories', category);
      navigate('/categories');
    } catch (err) {
      setError('Kategori eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="category-form-container">
      <h2>Yeni Kategori Ekle</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Kategori Adı</label>
          <input
            type="text"
            value={category.name}
            onChange={(e) => setCategory({...category, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Açıklama</label>
          <textarea
            value={category.description}
            onChange={(e) => setCategory({...category, description: e.target.value})}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/categories')} className="cancel-button">
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

export default AddCategory; 