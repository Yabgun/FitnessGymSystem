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
    <div className="form-container">
      <h2>Yeni Üye Ekle</h2>
      {error && <div className="error-message">{error}</div>}
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
            {classes && classes.map((cls, index) => (
              <div key={`class-${cls.id || index}`} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`class-${cls.id || index}`}
                  value={cls.id}
                  checked={member.selectedClasses.includes(cls.id)}
                  onChange={handleClassChange}
                />
                <label htmlFor={`class-${cls.id || index}`}>{cls.className}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/members')} className="button button-secondary">
            İptal
          </button>
          <button type="submit" className="button button-primary">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMember; 