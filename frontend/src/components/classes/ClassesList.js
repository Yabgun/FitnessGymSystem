import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Classes.css';

function ClassesList() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/Classes');
      setClasses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Sınıflar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu sınıfı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Classes/${id}`);
        fetchClasses();
      } catch (err) {
        setError('Sınıf silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="classes-list-container">
      <div className="list-header">
        <h2>Sınıflar</h2>
        <button onClick={() => navigate('/classes/add')} className="add-button">
          Yeni Sınıf
        </button>
      </div>

      <div className="classes-grid">
        {classes.map(classItem => (
          <div key={classItem.id} className="class-card">
            <div className="class-header">
              <h3>{classItem.className}</h3>
              <span className="category-badge">
                {classItem.classCategory?.name}
              </span>
            </div>
            <p className="class-description">{classItem.description}</p>
            <div className="class-details">
              <p>
                <strong>Eğitmen:</strong> {classItem.instructor?.firstName} {classItem.instructor?.lastName}
              </p>
              <p>
                <strong>Saat:</strong> {classItem.startTime} - {classItem.endTime}
              </p>
              {classItem.memberClasses && classItem.memberClasses.length > 0 && (
                <p>
                  <strong>Kayıtlı Üye Sayısı:</strong> {classItem.memberClasses.length}
                </p>
              )}
            </div>
            <div className="card-actions">
              <button 
                onClick={() => navigate(`/classes/edit/${classItem.id}`)}
                className="edit-button"
              >
                Düzenle
              </button>
              <button 
                onClick={() => handleDelete(classItem.id)}
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

export default ClassesList; 