import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Categories.css';
import '../../styles/common.css';

function AddCategory() {
  const [category, setCategory] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!category.name.trim()) {
        setError('Kategori adı zorunludur');
        setLoading(false);
        return;
      }

      await axios.post('/api/ClassCategories', {
        name: category.name.trim(),
        description: category.description.trim()
      });
      navigate('/categories');
    } catch (err) {
      console.error('Kategori ekleme hatası:', err);
      setError('Kategori eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Yeni Kategori Ekle</h1>
      </div>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-section">
            <h2 className="section-title">Kategori Bilgileri</h2>
            
            <div className="form-group">
              <label>Kategori Adı: *</label>
              <input
                type="text"
                value={category.name}
                onChange={(e) => setCategory({...category, name: e.target.value})}
                required
                className="form-control"
                placeholder="Kategori adını giriniz"
                maxLength={100}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Açıklama:</label>
              <textarea
                value={category.description}
                onChange={(e) => setCategory({...category, description: e.target.value})}
                className="form-control"
                placeholder="Kategori açıklamasını giriniz"
                rows="4"
                maxLength={500}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/categories')}
              className="button button-secondary"
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="button button-primary"
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategory; 