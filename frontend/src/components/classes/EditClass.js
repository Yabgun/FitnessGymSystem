import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import './Classes.css';

function EditClass() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [classData, setClassData] = useState({
        className: '',
        description: '',
        startTime: '',
        endTime: '',
        capacity: '',
        classCategoryId: '',
        instructorId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classRes, categoriesRes, instructorsRes] = await Promise.all([
                    axios.get(`/api/Classes/${id}`),
                    axios.get('/api/ClassCategories'),
                    axios.get('/api/Instructors')
                ]);

                // Saat formatını düzenle
                const startTime = new Date(classRes.data.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = new Date(classRes.data.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                setClassData({
                    ...classRes.data,
                    startTime,
                    endTime
                });
                setCategories(categoriesRes.data);
                setInstructors(instructorsRes.data);
            } catch (err) {
                console.error('Veri yüklenirken hata:', err);
                setError('Veriler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const today = new Date().toISOString().split('T')[0];
            const [startHours, startMinutes] = classData.startTime.split(':');
            const [endHours, endMinutes] = classData.endTime.split(':');
            
            const startTime = new Date(`${today}T${startHours}:${startMinutes}:00`);
            const endTime = new Date(`${today}T${endHours}:${endMinutes}:00`);

            const formattedData = {
                ...classData,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                capacity: parseInt(classData.capacity),
                classCategoryId: parseInt(classData.classCategoryId),
                instructorId: parseInt(classData.instructorId)
            };

            await axios.put(`/api/Classes/${id}`, formattedData);
            navigate('/classes');
        } catch (err) {
            console.error('Güncelleme hatası:', err);
            setError(err.response?.data?.message || 'Sınıf güncellenirken bir hata oluştu.');
        }
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="class-form">
            <h2>Sınıf Düzenle</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Sınıf Adı:</label>
                    <input
                        type="text"
                        value={classData.className}
                        onChange={(e) => setClassData({...classData, className: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Kategori:</label>
                    <select
                        value={classData.classCategoryId}
                        onChange={(e) => setClassData({...classData, classCategoryId: e.target.value})}
                        required
                    >
                        <option value="">Seçiniz</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Eğitmen:</label>
                    <select
                        value={classData.instructorId}
                        onChange={(e) => setClassData({...classData, instructorId: e.target.value})}
                        required
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
                    <label>Başlangıç Saati:</label>
                    <input
                        type="time"
                        value={classData.startTime}
                        onChange={(e) => setClassData({...classData, startTime: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Bitiş Saati:</label>
                    <input
                        type="time"
                        value={classData.endTime}
                        onChange={(e) => setClassData({...classData, endTime: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Kapasite:</label>
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={classData.capacity}
                        onChange={(e) => setClassData({...classData, capacity: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Açıklama:</label>
                    <textarea
                        value={classData.description}
                        onChange={(e) => setClassData({...classData, description: e.target.value})}
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/classes')} className="button button-secondary">
                        İptal
                    </button>
                    <button type="submit" className="button button-primary">
                        Güncelle
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditClass; 