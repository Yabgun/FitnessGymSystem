import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function ClassesList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/Classes');
      if (Array.isArray(response.data)) {
        setClasses(response.data);
      } else {
        setError('Veri formatı geçersiz');
        console.error('Invalid data format:', response.data);
      }
    } catch (error) {
      setError('Sınıflar yüklenirken bir hata oluştu');
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Invalid class ID');
      return;
    }

    if (window.confirm('Bu sınıfı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/Classes/${id}`);
        await fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Sınıf silinirken bir hata oluştu');
      }
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Belirtilmemiş';
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (error) {
      console.error('Saat formatı hatası:', error);
      return 'Geçersiz Saat';
    }
  };

  const getDayName = (dayOfWeek) => {
    if (dayOfWeek === undefined || dayOfWeek === null) return 'Belirtilmemiş';
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[dayOfWeek] || 'Geçersiz Gün';
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
        <h1 className="page-title">Sınıflar</h1>
        <button 
          className="button button-primary"
          onClick={() => navigate('/classes/add')}
        >
          Yeni Sınıf Ekle
        </button>
      </div>

      <div className="grid-container">
        {classes.length === 0 ? (
          <div className="no-data">Henüz sınıf bulunmamaktadır.</div>
        ) : (
          classes.map(classItem => (
            <div key={classItem?.id || Math.random()} className="card">
              <h2>{classItem?.className || 'İsimsiz Sınıf'}</h2>
              <div className="class-details">
                <p>
                  <strong>Kategori:</strong> {classItem?.category?.name || 'Belirtilmemiş'}
                </p>
                <p>
                  <strong>Eğitmen:</strong> {classItem?.instructor ? 
                    `${classItem.instructor.firstName || ''} ${classItem.instructor.lastName || ''}` : 
                    'Belirtilmemiş'}
                </p>
                <p>
                  <strong>Gün:</strong> {getDayName(classItem?.dayOfWeek)}
                </p>
                <p>
                  <strong>Saat:</strong> {formatTime(classItem?.startTime)} - {formatTime(classItem?.endTime)}
                </p>
                <p>
                  <strong>Kapasite:</strong> {classItem?.capacity || 0} Kişi
                </p>
                {classItem?.description && (
                  <p className="class-description">
                    <strong>Açıklama:</strong> {classItem.description}
                  </p>
                )}
              </div>
              <div className="card-actions">
                <button 
                  className="button button-secondary"
                  onClick={() => classItem?.id && navigate(`/classes/edit/${classItem.id}`)}
                  disabled={!classItem?.id}
                >
                  <i className="fas fa-edit"></i> Düzenle
                </button>
                <button 
                  className="button button-danger"
                  onClick={() => classItem?.id && handleDelete(classItem.id)}
                  disabled={!classItem?.id}
                >
                  <i className="fas fa-trash"></i> Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClassesList; 