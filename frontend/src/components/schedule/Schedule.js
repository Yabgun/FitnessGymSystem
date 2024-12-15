import React, { useState, useEffect } from 'react';
import axios from '../../services/axiosConfig';
import './Schedule.css';

function Schedule() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Saat aralıkları (24 saat)
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
    });

    // Haftanın günleri
    const days = [
        { value: 1, label: 'Pazartesi' },
        { value: 2, label: 'Salı' },
        { value: 3, label: 'Çarşamba' },
        { value: 4, label: 'Perşembe' },
        { value: 5, label: 'Cuma' },
        { value: 6, label: 'Cumartesi' },
        { value: 0, label: 'Pazar' }
    ];

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('/api/Classes');
            setClasses(response.data);
            setError('');
        } catch (err) {
            setError('Sınıflar yüklenirken bir hata oluştu');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Belirli bir gün ve saat için sınıf kontrolü
    const getClassForTimeSlot = (day, timeSlot) => {
        return classes.filter(cls => {
            try {
                if (!cls.startTime || !cls.endTime) return false;
                
                const startHour = parseInt(cls.startTime.split(':')[0]);
                const endHour = parseInt(cls.endTime.split(':')[0]);
                const slotHour = parseInt(timeSlot);

                return (
                    cls.dayOfWeek === day.value && 
                    startHour <= slotHour && 
                    endHour > slotHour
                );
            } catch (error) {
                console.error('Sınıf kontrolünde hata:', error);
                return false;
            }
        });
    };

    if (loading) return <div className="loading">Yükleniyor...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="schedule-container">
            <h1>Haftalık Program</h1>
            <div className="schedule-grid">
                {/* Zaman başlıkları */}
                <div className="time-column">
                    <div className="header-cell">Saat</div>
                    {timeSlots.map(time => (
                        <div key={time} className="time-cell">
                            {time}
                        </div>
                    ))}
                </div>

                {/* Günler ve sınıflar */}
                {days.map(day => (
                    <div key={day.value} className="day-column">
                        <div className="header-cell">{day.label}</div>
                        {timeSlots.map(timeSlot => {
                            const classesInSlot = getClassForTimeSlot(day, timeSlot);
                            return (
                                <div key={`${day.value}-${timeSlot}`} className="schedule-cell">
                                    {classesInSlot.map(cls => (
                                        <div key={cls.id} className="class-item">
                                            <div className="class-name">{cls.className}</div>
                                            <div className="class-time">
                                                {cls.startTime.substring(0, 5)} - {cls.endTime.substring(0, 5)}
                                            </div>
                                            <div className="class-instructor">
                                                {cls.instructor?.firstName} {cls.instructor?.lastName}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Schedule; 