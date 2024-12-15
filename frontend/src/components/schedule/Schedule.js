import React, { useState, useEffect } from 'react';
import axios from '../../services/axiosConfig';
import './Schedule.css';

function Schedule() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/Classes');
      setClasses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Program yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8); // 08:00 - 21:00
  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="schedule-container">
      <h2>Haftalık Ders Programı</h2>
      
      <div className="schedule-grid">
        <div className="time-column">
          <div className="header-cell">Saat</div>
          {timeSlots.map(time => (
            <div key={time} className="time-cell">
              {`${time.toString().padStart(2, '0')}:00`}
            </div>
          ))}
        </div>

        {daysOfWeek.map(day => (
          <div key={day} className="day-column">
            <div className="header-cell">{day}</div>
            {timeSlots.map(time => {
              const classesAtTime = classes.filter(cls => {
                const startHour = new Date(`1970-01-01T${cls.startTime}`).getHours();
                return startHour === time;
              });

              return (
                <div key={time} className="schedule-cell">
                  {classesAtTime.map(cls => (
                    <div key={cls.id} className="class-item">
                      <div className="class-name">{cls.className}</div>
                      <div className="class-details">
                        <small>{cls.instructor?.firstName} {cls.instructor?.lastName}</small>
                        <small>({cls.capacity} kişilik)</small>
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