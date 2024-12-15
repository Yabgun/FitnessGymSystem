import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Categories.css';

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
      await axios.post('/api/ClassCategories', category);
      navigate('/categories');
    } catch (err) {
      setError('Kategori eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="category-form">
      <h2>Yeni Kategori Ekle</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kategori Adı:</label>
          <input
            type="text"
            value={category.name}
            onChange={(e) => setCategory({...category, name: e.target.value})}
            required
            maxLength={100}
          />
        </div>

        <div>
          <label>Açıklama:</label>
          <textarea
            value={category.description}
            onChange={(e) => setCategory({...category, description: e.target.value})}
            maxLength={500}
          />
        </div>

        <button type="submit">Kaydet</button>
        <button type="button" onClick={() => navigate('/categories')}>İptal</button>
      </form>
    </div>
  );
}

export default AddCategory; 