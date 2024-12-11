import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Categories.css';

function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/api/ClassCategories/${id}`);
      setCategory(response.data);
    } catch (err) {
      setError('Kategori yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/ClassCategories/${id}`, category);
      navigate('/categories');
    } catch (err) {
      setError('Kategori güncellenirken bir hata oluştu');
    }
  };

  return (
    <div className="category-form-container">
      <h2>Kategori Düzenle</h2>
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
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCategory; 