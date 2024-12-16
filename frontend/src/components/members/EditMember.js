import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';
import './Members.css';

function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    memberClasses: []
  });

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberResponse, classesResponse] = await Promise.all([
          axios.get(`/api/Members/${id}`),
          axios.get('/api/Classes')
        ]);
        
        const memberData = memberResponse.data;
        setMember({
          ...memberData,
          dateOfBirth: memberData.dateOfBirth.split('T')[0]
        });
        
        setClasses(classesResponse.data);
        // Üyenin mevcut sınıfını seç
        if (memberData.memberClasses && memberData.memberClasses.length > 0) {
          setSelectedClassId(memberData.memberClasses[0].classId);
        }
      } catch (err) {
        setError('Üye bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedClassId) {
      setError('Lütfen bir sınıf seçin');
      return;
    }

    try {
      setLoading(true);
      
      // Seçilen sınıfı bul
      const selectedClass = classes.find(c => c.id === selectedClassId);
      if (!selectedClass) {
        throw new Error('Seçilen sınıf bulunamadı');
      }

      const updatedMember = {
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: member.dateOfBirth,
        selectedClasses: [selectedClassId]
      };

      await axios.put(`/api/Members/${id}`, updatedMember);
      navigate('/members');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setError('Üye güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container">Yükleniyor...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Üye Düzenle</h1>
      </div>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="edit-member-form">
          <div className="form-section">
            <h2 className="section-title">Kişisel Bilgiler</h2>
            <div className="form-group">
              <label>Ad:</label>
              <input
                type="text"
                value={member.firstName}
                onChange={(e) => setMember({...member, firstName: e.target.value})}
                required
                className="form-control"
                placeholder="Adı giriniz"
              />
            </div>

            <div className="form-group">
              <label>Soyad:</label>
              <input
                type="text"
                value={member.lastName}
                onChange={(e) => setMember({...member, lastName: e.target.value})}
                required
                className="form-control"
                placeholder="Soyadı giriniz"
              />
            </div>

            <div className="form-group">
              <label>Doğum Tarihi:</label>
              <input
                type="date"
                value={member.dateOfBirth}
                onChange={(e) => setMember({...member, dateOfBirth: e.target.value})}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Sınıf Seçimi</h2>
            <p className="section-description">Üyenin katılacağı sınıfı seçin. Sadece bir sınıf seçilebilir.</p>
            
            <div className="class-selection">
              {classes.map(cls => (
                <div key={cls.id} className={`class-card ${selectedClassId === cls.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id={`class-${cls.id}`}
                    name="classSelection"
                    value={cls.id}
                    checked={selectedClassId === cls.id}
                    onChange={(e) => setSelectedClassId(parseInt(e.target.value))}
                    required
                  />
                  <label htmlFor={`class-${cls.id}`}>
                    <div className="class-name">{cls.className}</div>
                    <div className="class-details">
                      <div className="instructor">
                        <i className="fas fa-user"></i>
                        {cls.instructor ? `${cls.instructor.firstName} ${cls.instructor.lastName}` : 'Eğitmen atanmamış'}
                      </div>
                      <div className="schedule">
                        <i className="fas fa-clock"></i>
                        {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/members')}
              className="button button-secondary"
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="button button-primary"
              disabled={loading}
            >
              {loading ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMember; 