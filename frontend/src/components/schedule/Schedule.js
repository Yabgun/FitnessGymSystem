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
      console.log('Alınan sınıflar:', response.data);
      setClasses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Program yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  // 08:00'dan 21:00'a kadar yarım saatlik dilimler (toplam 27 dilim)
  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? '00' : '30';
    return { hour, minute };
  });

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const dayMapping = {
    'Pazartesi': 1,
    'Salı': 2,
    'Çarşamba': 3,
    'Perşembe': 4,
    'Cuma': 5,
    'Cumartesi': 6,
    'Pazar': 0
  };

  const getTimeSlotPosition = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    if (hours < 8 || hours >= 21 || (hours === 21 && minutes > 0)) {
      return -1; // Geçersiz zaman dilimi
    }
    return (hours - 8) * 2 + (minutes >= 30 ? 1 : 0);
  };

  const getClassDuration = (startTime, endTime) => {
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    // Toplam yarım saat dilimi sayısını hesapla
    const startSlots = (startHour - 8) * 2 + (startMinute >= 30 ? 1 : 0);
    const endSlots = (endHour - 8) * 2 + (endMinute >= 30 ? 1 : 0);
    
    // Süreyi hesapla
    return endSlots - startSlots + 1; // +1 ekliyoruz çünkü bitiş saatini de dahil etmeliyiz
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="schedule-container">
      <h2>Haftalık Ders Programı</h2>
      
      <div className="schedule-grid">
        <div className="time-column">
          <div className="header-cell">Saat</div>
          {timeSlots.map((slot, index) => (
            <div key={index} className="time-cell">
              {`${slot.hour.toString().padStart(2, '0')}:${slot.minute}`}
            </div>
          ))}
        </div>

        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} className="day-column">
            <div className="header-cell">{day}</div>
            <div className="day-cells">
              {timeSlots.map((_, index) => {
                const classesForDay = classes.filter(cls => {
                  const classDay = cls.dayOfWeek;
                  const mappedDayIndex = dayMapping[day];
                  
                  const startTime = new Date(cls.startTime);
                  const endTime = new Date(cls.endTime);
                  const slotStart = index;
                  const classStart = getTimeSlotPosition(startTime);
                  const classEnd = getTimeSlotPosition(endTime);

                  console.log('Sınıf kontrolü:', {
                    className: cls.className,
                    classDay,
                    mappedDayIndex,
                    startTime: startTime.toLocaleTimeString(),
                    endTime: endTime.toLocaleTimeString(),
                    slotStart,
                    classStart,
                    classEnd
                  });
                  
                  return classDay === mappedDayIndex && 
                         classStart !== -1 && 
                         classEnd !== -1 && 
                         slotStart >= classStart && 
                         slotStart < classEnd;
                });

                return (
                  <div key={index} className="schedule-cell">
                    {classesForDay.map(cls => {
                      const startTime = new Date(cls.startTime);
                      const endTime = new Date(cls.endTime);
                      
                      if (getTimeSlotPosition(startTime) === index) {
                        const duration = getClassDuration(startTime, endTime);
                        console.log('Süre hesaplaması:', {
                          className: cls.className,
                          startTime: startTime.toLocaleTimeString(),
                          endTime: endTime.toLocaleTimeString(),
                          duration
                        });

                        return (
                          <div
                            key={cls.id}
                            className="class-item"
                            style={{
                              height: `${duration * 100}%`,
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              zIndex: 1
                            }}
                          >
                            <div className="class-name">{cls.className}</div>
                            <div className="class-time">
                              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule; 