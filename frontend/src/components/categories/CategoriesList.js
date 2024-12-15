import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/ClassCategories');
      console.log('Gelen kategoriler:', response.data); // Debug için
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setError('Veri formatı geçersiz');
        console.error('Invalid data format:', response.data);
      }
    } catch (error) {
      setError('Kategoriler yüklenirken bir hata oluştu');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Invalid category ID');
      return;
    }

    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/ClassCategories/${id}`);
        await fetchCategories(); // Listeyi yenile
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Kategori silinirken bir hata oluştu');
      }
    }
  };

  if (loading) {
    return <div className="page-container">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="page-container">
      <div className="error-message">{error}</div>
    </div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Kategoriler</h1>
        <button onClick={() => navigate('/categories/add')} className="button button-primary">
          Yeni Kategori Ekle
        </button>
      </div>

      <div className="grid-container">
        {categories.length === 0 ? (
          <div className="no-data">Henüz kategori bulunmamaktadır.</div>
        ) : (
          categories.map((category) => (
            <div key={category?.id || Math.random()} className="card">
              <h2>{category?.name || category?.Name || 'İsimsiz Kategori'}</h2>
              {(category?.description || category?.Description) && (
                <p className="category-description">
                  {category?.description || category?.Description}
                </p>
              )}
              <div className="card-actions">
                <button
                  onClick={() => navigate(`/categories/edit/${category.id || category.Id}`)}
                  className="button button-secondary"
                  disabled={!category?.id && !category?.Id}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => (category?.id || category?.Id) && handleDelete(category.id || category.Id)}
                  className="button button-danger"
                  disabled={!category?.id && !category?.Id}
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoriesList; 