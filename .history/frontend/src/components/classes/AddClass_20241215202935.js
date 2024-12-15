import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Classes.css';

function AddClass() {
  const [classData, setClassData] = useState({
    className: '',
    description: '',
    startTime: '',
    endTime: '',
    capacity: '',
    classCategoryId: '',
    instructorId: ''
  });
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, instructorsRes] = await Promise.all([
          axios.get('/api/ClassCategories'),
          axios.get('/api/Instructors')
        ]);
        
        console.log('Kategoriler:', categoriesRes.data);
        console.log('Eğitmenler:', instructorsRes.data);
        
        setCategories(categoriesRes.data);
        setInstructors(instructorsRes.data);
        setError('');
      } catch (err) {
        console.error('Veri yüklenirken hata:', err);
        setError('Kategoriler ve eğitmenler yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    if (!classData.className.trim()) {
      setError('Sınıf adı zorunludur.');
      return false;
    }
    if (!classData.description.trim()) {
      setError('Açıklama zorunludur.');
      return false;
    }
    if (!classData.classCategoryId) {
      setError('Kategori seçimi zorunludur.');
      return false;
    }
    if (!classData.instructorId) {
      setError('Eğitmen seçimi zorunludur.');
      return false;
    }
    if (!classData.startTime) {
      setError('Başlangıç saati zorunludur.');
      return false;
    }
    if (!classData.endTime) {
      setError('Bitiş saati zorunludur.');
      return false;
    }
    if (!classData.capacity || parseInt(classData.capacity) < 1 || parseInt(classData.capacity) > 50) {
      setError('Kapasite 1-50 arası olmalıdır.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Tarih ve saat formatını düzenleme
      const today = new Date().toISOString().split('T')[0];
      const formattedData = {
        className: classData.className.trim(),
        description: classData.description || "",
        startTime: `${today}T${classData.startTime}:00`,
        endTime: `${today}T${classData.endTime}:00`,
        capacity: parseInt(classData.capacity),
        instructorId: parseInt(classData.instructorId),
        classCategoryId: parseInt(classData.classCategoryId),
        memberClasses: []
      };

      console.log('Gönderilecek veri:', formattedData);

      const response = await axios.post('/api/Classes', formattedData);
      console.log('Sunucu yanıtı:', response.data);
      
      navigate('/classes');
    } catch (err) {
      console.error('Sınıf eklenirken hata:', err);
      console.error('Hata detayı:', err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Sınıf eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="class-form">
      <h2>Yeni Sınıf Ekle</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sınıf Adı: *</label>
          <input
            type="text"
            value={classData.className}
            onChange={(e) => setClassData({...classData, className: e.target.value})}
            required
            disabled={loading}
            maxLength={100}
            placeholder="Sınıf adını girin"
          />
        </div>

        <div className="form-group">
          <label>Kategori: *</label>
          <select
            value={classData.classCategoryId}
            onChange={(e) => setClassData({...classData, classCategoryId: e.target.value})}
            required
            disabled={loading}
          >
            <option value="">Seçiniz</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Eğitmen: *</label>
          <select
            value={classData.instructorId}
            onChange={(e) => setClassData({...classData, instructorId: e.target.value})}
            required
            disabled={loading}
          >
            <option value="">Seçiniz</option>
            {instructors.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.firstName} {inst.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Başlangıç Saati: *</label>
          <input
            type="time"
            value={classData.startTime}
            onChange={(e) => setClassData({...classData, startTime: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Bitiş Saati: *</label>
          <input
            type="time"
            value={classData.endTime}
            onChange={(e) => setClassData({...classData, endTime: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Kapasite: * (1-50 arası)</label>
          <input
            type="number"
            min="1"
            max="50"
            value={classData.capacity}
            onChange={(e) => setClassData({...classData, capacity: e.target.value})}
            required
            disabled={loading}
            placeholder="Maksimum öğrenci sayısı"
          />
        </div>

        <div className="form-group">
          <label>Açıklama: *</label>
          <textarea
            value={classData.description}
            onChange={(e) => setClassData({...classData, description: e.target.value})}
            required
            disabled={loading}
            maxLength={500}
            placeholder="Sınıf hakkında açıklama girin"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/classes')}
            className="cancel-button"
            disabled={loading}
          >
            İptal
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClass; 