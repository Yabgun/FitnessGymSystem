import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/ClassCategories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/ClassCategories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) {
    return <div className="page-container">Yükleniyor...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Kategoriler</h1>
        <button 
          className="button button-primary"
          onClick={() => navigate('/categories/add')}
        >
          Yeni Kategori Ekle
        </button>
      </div>

      <div className="grid-container">
        {categories.map(category => (
          <div key={category.id} className="card">
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            
            <div className="card-actions">
              <button 
                className="button button-secondary"
                onClick={() => navigate(`/categories/edit/${category.id}`)}
              >
                Düzenle
              </button>
              <button 
                className="button button-danger"
                onClick={() => handleDelete(category.id)}
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