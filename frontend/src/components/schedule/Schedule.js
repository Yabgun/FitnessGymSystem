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
      const sortedClasses = response.data.sort((a, b) => {
        // Önce startTime'a göre sırala
        return new Date('1970/01/01 ' + a.startTime) - new Date('1970/01/01 ' + b.startTime);
      });
      setClasses(sortedClasses);
      setLoading(false);
    } catch (err) {
      setError('Program yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const groupClassesByTime = () => {
    const groupedClasses = {};
    classes.forEach(cls => {
      const time = `${cls.startTime} - ${cls.endTime}`;
      if (!groupedClasses[time]) {
        groupedClasses[time] = [];
      }
      groupedClasses[time].push(cls);
    });
    return groupedClasses;
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const groupedClasses = groupClassesByTime();

  return (
    <div className="schedule-container">
      <h2>Ders Programı</h2>
      
      <div className="schedule-grid">
        {Object.entries(groupedClasses).map(([time, timeClasses]) => (
          <div key={time} className="time-slot">
            <div className="time-header">{time}</div>
            <div className="classes-list">
              {timeClasses.map(cls => (
                <div key={cls.id} className="schedule-class-card">
                  <h3>{cls.className}</h3>
                  <div className="class-info">
                    <p>
                      <strong>Eğitmen:</strong> {cls.instructor?.firstName} {cls.instructor?.lastName}
                    </p>
                    <p>
                      <strong>Kategori:</strong> {cls.classCategory?.name}
                    </p>
                    {cls.memberClasses && (
                      <p>
                        <strong>Katılımcı Sayısı:</strong> {cls.memberClasses.length}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule; 