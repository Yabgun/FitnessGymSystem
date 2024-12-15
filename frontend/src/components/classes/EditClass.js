import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Classes.css';

function EditClass() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

  // Saat ve dakika seçenekleri için state'ler
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');

  // Saat ve dakika seçeneklerini oluştur
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  // Saat değişikliklerini handle et
  const handleTimeChange = (type, value) => {
    let newStartTime = classData.startTime;
    let newEndTime = classData.endTime;

    if (type === 'startHour') {
      setStartHour(value);
      newStartTime = `${value}:${startMinute || '00'}`;
    } else if (type === 'startMinute') {
      setStartMinute(value);
      newStartTime = `${startHour || '00'}:${value}`;
    } else if (type === 'endHour') {
      setEndHour(value);
      newEndTime = `${value}:${endMinute || '00'}`;
    } else if (type === 'endMinute') {
      setEndMinute(value);
      newEndTime = `${endHour || '00'}:${value}`;
    }

    setClassData(prev => ({
      ...prev,
      startTime: newStartTime,
      endTime: newEndTime
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, categoriesRes, instructorsRes] = await Promise.all([
          axios.get(`/api/Classes/${id}`),
          axios.get('/api/ClassCategories'),
          axios.get('/api/Instructors')
        ]);

        const classItem = classResponse.data;
        const startDate = new Date(classItem.startTime);
        const endDate = new Date(classItem.endTime);

        // Saat ve dakika değerlerini ayarla
        setStartHour(String(startDate.getHours()).padStart(2, '0'));
        setStartMinute(String(startDate.getMinutes()).padStart(2, '0'));
        setEndHour(String(endDate.getHours()).padStart(2, '0'));
        setEndMinute(String(endDate.getMinutes()).padStart(2, '0'));

        setClassData({
          ...classItem,
          startTime: `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`,
          endTime: `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`,
          classCategoryId: classItem.classCategoryId.toString(),
          instructorId: classItem.instructorId.toString(),
          dayOfWeek: classItem.dayOfWeek.toString()
        });
        
        setCategories(categoriesRes.data);
        setInstructors(instructorsRes.data);
        setError('');
      } catch (err) {
        console.error('Veri yüklenirken hata:', err);
        setError('Veriler yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
    if (!classData.dayOfWeek) {
      setError('Gün seçimi zorunludur.');
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

      // Bugünün tarihini al ve saatleri ekle
      const today = new Date();
      const [startHours, startMinutes] = classData.startTime.split(':');
      const [endHours, endMinutes] = classData.endTime.split(':');

      const startTime = new Date(today);
      startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

      const endTime = new Date(today);
      endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

      // Eğer bitiş saati başlangıç saatinden küçükse, bitiş saatini bir sonraki güne ayarla
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }

      const formattedData = {
        id: parseInt(id),
        className: classData.className.trim(),
        description: classData.description || "",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        capacity: parseInt(classData.capacity),
        instructorId: parseInt(classData.instructorId),
        classCategoryId: parseInt(classData.classCategoryId),
        dayOfWeek: parseInt(classData.dayOfWeek)
      };

      await axios.put(`/api/Classes/${id}`, formattedData);
      navigate('/classes');
    } catch (err) {
      console.error('Sınıf güncellenirken hata:', err);
      setError('Sınıf güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="class-form">
      <h2>Sınıf Düzenle</h2>
      
      {error && <div className="error-message">{error}</div>}
      
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
          <label>Gün: *</label>
          <select
            value={classData.dayOfWeek}
            onChange={(e) => setClassData({...classData, dayOfWeek: e.target.value})}
            required
            disabled={loading}
          >
            <option value="">Seçiniz</option>
            <option value="0">Pazar</option>
            <option value="1">Pazartesi</option>
            <option value="2">Salı</option>
            <option value="3">Çarşamba</option>
            <option value="4">Perşembe</option>
            <option value="5">Cuma</option>
            <option value="6">Cumartesi</option>
          </select>
        </div>

        <div className="form-group">
          <label>Başlangıç Saati: *</label>
          <div className="time-select">
            <select
              value={startHour}
              onChange={(e) => handleTimeChange('startHour', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Saat</option>
              {hours.map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <span>:</span>
            <select
              value={startMinute}
              onChange={(e) => handleTimeChange('startMinute', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Dakika</option>
              {minutes.map(minute => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Bitiş Saati: *</label>
          <div className="time-select">
            <select
              value={endHour}
              onChange={(e) => handleTimeChange('endHour', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Saat</option>
              {hours.map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <span>:</span>
            <select
              value={endMinute}
              onChange={(e) => handleTimeChange('endMinute', e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Dakika</option>
              {minutes.map(minute => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>
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
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditClass; 