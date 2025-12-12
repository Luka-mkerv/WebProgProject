import { useMemo } from 'react';
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
      const employee = employees.find(e => e.id === s.employeeId);
      const title = employee ? `${employee.name} (${s.position})` : s.position;

      const start = new Date(`${s.date}T${s.startTime}`);
      const end = new Date(`${s.date}T${s.endTime}`);

      return { id: s.id, title, start, end, allDay: false };
    });
  }, [shifts, employees]);

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
      />
    </div>
  );
}

export default ShiftCalendar;
