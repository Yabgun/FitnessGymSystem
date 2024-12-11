import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Members.css';

function AddMember() {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    selectedClasses: []
  });
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mevcut sınıfları yükle
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/Classes');
        setClasses(response.data);
      } catch (err) {
        setError('Sınıflar yüklenirken bir hata oluştu');
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        ...member,
        memberClasses: member.selectedClasses.map(classId => ({
          classId: parseInt(classId)
        }))
      };
      await axios.post('/api/Members', memberData);
      navigate('/members');
    } catch (err) {
      setError('Üye eklenirken bir hata oluştu');
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    const isChecked = e.target.checked;
    
    setMember(prev => ({
      ...prev,
      selectedClasses: isChecked 
        ? [...prev.selectedClasses, classId]
        : prev.selectedClasses.filter(id => id !== classId)
    }));
  };

  return (
    <div className="member-form-container">
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
          <div className="classes-grid">
            {classes.map(classItem => (
              <div key={classItem.id} className="class-checkbox">
                <input
                  type="checkbox"
                  id={`class-${classItem.id}`}
                  value={classItem.id}
                  checked={member.selectedClasses.includes(classItem.id.toString())}
                  onChange={handleClassChange}
                />
                <label htmlFor={`class-${classItem.id}`}>{classItem.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/members')} className="cancel-button">
            İptal
          </button>
          <button type="submit" className="submit-button">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMember; 