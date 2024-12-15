import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function ClassesList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/Classes');
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu sınıfı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Classes/${id}`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const getDayName = (dayOfWeek) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[dayOfWeek];
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return <div className="page-container">Yükleniyor...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Sınıflar</h1>
        <button 
          className="button button-primary"
          onClick={() => navigate('/classes/add')}
        >
          Yeni Sınıf Ekle
        </button>
      </div>

      <div className="grid-container">
        {classes.map(classItem => (
          <div key={classItem.id} className="card">
            <div className="class-header">
              <h2>{classItem.className}</h2>
              {classItem.classCategory && (
                <span className="category-badge">
                  {classItem.classCategory.name}
                </span>
              )}
            </div>
            <div className="class-details">
              <p>
                <span className="detail-label">Gün:</span>
                <span className="detail-value">{getDayName(classItem.dayOfWeek)}</span>
              </p>
              <p>
                <span className="detail-label">Eğitmen:</span>
                <span className="detail-value">
                  {classItem.instructor?.firstName} {classItem.instructor?.lastName}
                </span>
              </p>
              <p>
                <span className="detail-label">Saat:</span>
                <span className="detail-value">
                  {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                </span>
              </p>
              <p>
                <span className="detail-label">Kapasite:</span>
                <span className="detail-value">{classItem.capacity} Kişi</span>
              </p>
              {classItem.description && (
                <p className="class-description">{classItem.description}</p>
              )}
            </div>
            <div className="card-actions">
              <button 
                className="button button-secondary"
                onClick={() => navigate(`/classes/edit/${classItem.id}`)}
              >
                <i className="fas fa-edit"></i> Düzenle
              </button>
              <button 
                className="button button-danger"
                onClick={() => handleDelete(classItem.id)}
              >
                <i className="fas fa-trash"></i> Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassesList; 