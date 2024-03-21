import React, { useState, useEffect } from 'react';
import "./../assets/styles/Calendar.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getEmotionColorForDate } from './../firebaseConfig';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Firebase'den duygu durumlarına göre renkleri çek
    const fetchEvents = async () => {
      const emotionEvents = await getEmotionColorForDate();
      setEvents(emotionEvents);
    };

    fetchEvents();
  }, []);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: '',
          center: 'title',
          end: ''
        }}
        titleFormat={{ month: 'long', year: 'numeric' }}
        fixedWeekCount={false}
        events={events}
        contentHeight="auto"
        validRange={{
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0)
        }}
        eventContent={renderEventContent} // Custom render function
      />
    </div>
  )
}

// Function to render events with custom styling
const renderEventContent = (eventInfo) => {
  return (
    <div className="event-dot" style={{ backgroundColor: eventInfo.event.backgroundColor }}></div>
  );
};

export default Calendar