import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Categories.css';

function CategoriesList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/ClassCategories');
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError('Kategoriler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/ClassCategories/${id}`);
        fetchCategories();
      } catch (err) {
        setError('Kategori silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="categories-list-container">
      <div className="list-header">
        <h2>Sınıf Kategorileri</h2>
        <button onClick={() => navigate('/categories/add')} className="add-button">
          Yeni Kategori
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <div className="card-actions">
              <button 
                onClick={() => navigate(`/categories/edit/${category.id}`)}
                className="edit-button"
              >
                Düzenle
              </button>
              <button 
                onClick={() => handleDelete(category.id)}
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

export default CategoriesList; 