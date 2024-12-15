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
    instructorId: '',
    dayOfWeek: ''
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

  const daysOfWeek = [
    { value: 0, label: 'Pazar' },
    { value: 1, label: 'Pazartesi' },
    { value: 2, label: 'Salı' },
    { value: 3, label: 'Çarşamba' },
    { value: 4, label: 'Perşembe' },
    { value: 5, label: 'Cuma' },
    { value: 6, label: 'Cumartesi' }
  ];

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
    if (!classData.dayOfWeek) {
      setError('Gün seçimi zorunludur.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        if (!validateForm()) {
            return;
        }

        const [startHours, startMinutes] = classData.startTime.split(':');
        const [endHours, endMinutes] = classData.endTime.split(':');

        const formattedData = {
            ...classData,
            startTime: `${startHours}:${startMinutes}:00`,
            endTime: `${endHours}:${endMinutes}:00`,
            capacity: parseInt(classData.capacity),
            classCategoryId: parseInt(classData.classCategoryId),
            instructorId: parseInt(classData.instructorId),
            dayOfWeek: parseInt(classData.dayOfWeek)
        };

        console.log('Gönderilen veri:', formattedData);

        await axios.post('/api/Classes', formattedData);
        navigate('/classes');
    } catch (err) {
        setError(err.response?.data?.message || 'Sınıf eklenirken bir hata oluştu.');
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
            <option key="select-category" value="">Seçiniz</option>
            {categories && categories.map((cat, index) => (
              <option key={`cat-${cat.id || index}`} value={cat.id}>
                {cat.name}
              </option>
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
            <option key="select-instructor" value="">Seçiniz</option>
            {instructors && instructors.map((inst, index) => (
              <option key={`inst-${inst.id || index}`} value={inst.id}>
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

        <div className="form-group">
          <label>Gün: *</label>
          <select
            value={classData.dayOfWeek}
            onChange={(e) => setClassData({...classData, dayOfWeek: parseInt(e.target.value)})}
            required
          >
            <option key="select-day" value="">Gün Seçin</option>
            {daysOfWeek && daysOfWeek.map((day, index) => (
              <option key={`day-${day.value || index}`} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
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