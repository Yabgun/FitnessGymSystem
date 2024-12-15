import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function AddCategory() {
  const [category, setCategory] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!category.name.trim()) {
        setError('Kategori adı zorunludur');
        return;
      }

      const response = await axios.post('/api/ClassCategories', {
        Name: category.name,
        Description: category.description
      });

      if (response.data) {
        navigate('/categories');
      } else {
        setError('Kategori eklenirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Kategori ekleme hatası:', err);
      setError('Kategori eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Yeni Kategori Ekle</h1>
      </div>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kategori Adı:</label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => setCategory({...category, name: e.target.value})}
              required
              maxLength={100}
              placeholder="Kategori adını girin"
            />
          </div>

          <div className="form-group">
            <label>Açıklama:</label>
            <textarea
              value={category.description}
              onChange={(e) => setCategory({...category, description: e.target.value})}
              maxLength={500}
              placeholder="Kategori açıklamasını girin"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/categories')} className="button button-secondary">
              İptal
            </button>
            <button type="submit" className="button button-primary">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategory; 