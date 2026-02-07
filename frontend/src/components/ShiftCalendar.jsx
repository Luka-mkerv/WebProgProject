import { useMemo } from 'react';
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ShiftCalendar({ shifts, employees }) {
  const events = useMemo(() => {
    return shifts.map(s => {
      // Handle both cases: employeeId as string and as populated object
      const employeeId = typeof s.employeeId === 'string' ? s.employeeId : s.employeeId?._id;
      const employeeObj = typeof s.employeeId === 'object' ? s.employeeId : employees.find(e => e._id === employeeId);
      
      const title = employeeObj ? `${employeeObj.name} (${s.position})` : s.position;
      const color = employeeObj?.color || '#667eea';

      const start = new Date(`${s.date}T${s.startTime}`);
      const end = new Date(`${s.date}T${s.endTime}`);

      return { 
        id: s._id, 
        title, 
        start, 
        end, 
        allDay: false,
        color: color
      };
    });
  }, [shifts, employees]);

  // Custom event style getter to apply employee colors
  const eventStyleGetter = (event) => {
    console.log('Event:', event.title, 'Color:', event.color); // Debug log
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '6px',
        border: 'none',
        display: 'block',
        padding: '4px 6px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        opacity: 0.9,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    };
  };

  // Add style override for date buttons
  React.useEffect(() => {
    console.log('Applying date button styles...');
    const dateLinks = document.querySelectorAll('.rbc-date-cell a');
    console.log('Found', dateLinks.length, 'date links');
    
    dateLinks.forEach(link => {
      link.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)';
      link.style.color = '#ffffff';
      link.style.fontSize = '24px !important';
      link.style.fontWeight = '900';
      link.style.borderRadius = '8px';
      link.style.padding = '8px 14px';
      link.style.display = 'inline-flex';
      link.style.alignItems = 'center';
      link.style.justifyContent = 'center';
      link.style.minWidth = '46px';
      link.style.height = '40px';
      link.style.textDecoration = 'none';
      link.style.cursor = 'pointer';
      link.style.lineHeight = '1';
      link.style.letterSpacing = '-0.5px';
      link.style.transition = 'all 0.2s ease';
      link.style.border = 'none';
      
      // Also style any child elements
      const children = link.querySelectorAll('*');
      children.forEach(child => {
        child.style.fontSize = '24px !important';
        child.style.fontWeight = '900 !important';
        child.style.color = '#ffffff !important';
      });
    });
  }, []);

  return (
    <div style={{ height: '600px', margin: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['week', 'day', 'agenda']}
        step={30}
        showMultiDayTimes
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}

export default ShiftCalendar;