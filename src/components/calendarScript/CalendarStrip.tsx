import "./CalendarStrip.css";

interface Props {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function CalendarStrip({
  selectedDate,
  setSelectedDate,
}: Props) {
  // Get current date to calculate week days
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Adjust to start from Monday (1) instead of Sunday (0)
  const startOffset = currentDayOfWeek === 0 ? -6 : -(currentDayOfWeek - 1);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + startOffset + i);
    return d;
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <p className="month">
        {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
      </p>
      <div className="calendar">
        {days.map((d) => {
          const isActive = d.toDateString() === selectedDate.toDateString();
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

          return (
            <div
              key={d.toDateString()}
              className={`day ${isActive ? "active" : ""}`}
              onClick={() => setSelectedDate(d)}
            >
              <span className="day-name">{dayNames[d.getDay()]}</span>
              <strong className="day-number">{d.getDate()}</strong>
            </div>
          );
        })}
      </div>
    </>
  );
}
