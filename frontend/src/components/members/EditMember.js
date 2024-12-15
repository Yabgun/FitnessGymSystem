import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
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
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [error, setError] = useState('');

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
        setSelectedClasses(memberData.memberClasses.map(mc => mc.classId));
      } catch (err) {
        setError('Üye bilgileri yüklenirken bir hata oluştu');
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedMember = {
        ...member,
        id: parseInt(id),
        memberClasses: selectedClasses.map(classId => ({
          classId: parseInt(classId),
          memberId: parseInt(id)
        }))
      };

      await axios.put(`/api/Members/${id}`, updatedMember);
      navigate('/members');
    } catch (err) {
      setError('Üye güncellenirken bir hata oluştu');
    }
  };

  const handleClassChange = (e) => {
    const classId = parseInt(e.target.value);
    setSelectedClasses(prev => 
      e.target.checked
        ? [...prev, classId]
        : prev.filter(id => id !== classId)
    );
  };

  return (
    <div className="edit-member-form">
      <h2>Üye Düzenle</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ad:</label>
          <input
            type="text"
            value={member.firstName}
            onChange={(e) => setMember({...member, firstName: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Soyad:</label>
          <input
            type="text"
            value={member.lastName}
            onChange={(e) => setMember({...member, lastName: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Doğum Tarihi:</label>
          <input
            type="date"
            value={member.dateOfBirth}
            onChange={(e) => setMember({...member, dateOfBirth: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Katıldığı Sınıflar:</label>
          {classes.map(cls => (
            <div key={cls.id}>
              <input
                type="checkbox"
                value={cls.id}
                checked={selectedClasses.includes(cls.id)}
                onChange={handleClassChange}
              />
              <label>{cls.className}</label>
            </div>
          ))}
        </div>

        <div className="form-buttons">
          <button type="submit">Güncelle</button>
          <button type="button" onClick={() => navigate('/members')}>İptal</button>
        </div>
      </form>
    </div>
  );
}

export default EditMember; 