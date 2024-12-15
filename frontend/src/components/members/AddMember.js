import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/common.css';

function AddMember() {
  const [member, setMember] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    selectedClasses: []
  });
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Mevcut sınıfları yükle
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/Classes');
        setClasses(response.data);
      } catch (err) {
        setError('Sınıflar yüklenirken hata oluştu');
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/Members', member);
      navigate('/members');
    } catch (err) {
      setError('Üye eklenirken bir hata oluştu');
    }
  };

  const handleClassChange = (e) => {
    const classId = parseInt(e.target.value);
    setMember(prev => ({
      ...prev,
      selectedClasses: e.target.checked
        ? [...prev.selectedClasses, classId]
        : prev.selectedClasses.filter(id => id !== classId)
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Yeni Üye Ekle</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad</label>
            <input
              type="text"
              value={member.firstName}
              onChange={(e) => setMember({...member, firstName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Soyad</label>
            <input
              type="text"
              value={member.lastName}
              onChange={(e) => setMember({...member, lastName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Doğum Tarihi</label>
            <input
              type="date"
              value={member.dateOfBirth}
              onChange={(e) => setMember({...member, dateOfBirth: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Katılacağı Sınıflar</label>
            <div className="checkbox-group">
              {classes.map(cls => (
                <div key={cls.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={cls.id}
                    onChange={handleClassChange}
                  />
                  <label>{cls.className}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary">
              Kaydet
            </button>
            <button 
              type="button" 
              className="button button-secondary"
              onClick={() => navigate('/members')}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMember; 