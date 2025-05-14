import React, { useState, useEffect, useMemo } from "react";
import {
  fetchDoctorScheduleByDate,
  fetchDoctorAppointments,
  createDoctorSchedule, // Import the function to create appointment slots
} from "../../services/doctor/doctor_api"; // adjust import paths as needed

export default function Schedule({ selectedDate }) {
  // Define the width for each 15-minute slot and the gap between slots
  const slotWidth = 80;
  const gap = 4;

  // Start and end times in minutes (8:00 AM to 9:00 PM)
  const [scheduleStart, setScheduleStart] = useState(8 * 60);
  const scheduleEnd = 21 * 60;

  const [schedules, setSchedules] = useState({});
  const [appointments, setAppointments] = useState([]);

  // Helper to format a Date to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().slice(0, 10);

  // Determine the base date: use selectedDate if provided; otherwise, default to today.
  const baseDate = useMemo(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  }, [selectedDate]);

  // Memoize datesToShow so it doesn't change on every render.
  // Here we show the base date and the next two days.
  const datesToShow = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      dates.push(formatDate(date));
    }
    return dates;
  }, [baseDate]);

  // Fetch the schedule slots for each date
  useEffect(() => {
    const fetchSchedules = async () => {
      const scheduleMap = {};
      let minStartTime = scheduleEnd;

      await Promise.all(
        datesToShow.map(async (date) => {
          const data = await fetchDoctorScheduleByDate(date);
          scheduleMap[date] = data;

          // Update the earliest slot time, if any slot exists
          if (data.length > 0) {
            data.forEach((slot) => {
              const [startHour, startMin] = slot.slot.startTime.split(":").map(Number);
              const slotStart = startHour * 60 + startMin;
              minStartTime = Math.min(minStartTime, slotStart);
            });
          }
        })
      );

      setSchedules(scheduleMap);
      setScheduleStart(minStartTime);
    };

    fetchSchedules();
  }, [datesToShow, scheduleEnd]);

  // Fetch the appointments for the doctor
  useEffect(() => {
    const fetchAppointmentsData = async () => {
      const data = await fetchDoctorAppointments();
      setAppointments(data.content);
    };

    fetchAppointmentsData();
  }, []);

  // Generate time labels for the header in 15-minute increments
  const times = [];
  for (let t = scheduleStart; t <= scheduleEnd; t += 15) {
    const hrs = Math.floor(t / 60);
    const mins = t % 60;
    times.push(`${hrs}:${mins.toString().padStart(2, "0")}`);
  }

  // Define colors for appointment statuses; adjusted green for Completed
  const appointmentColors = {
    Upcoming: "bg-blue-500 text-white",
    Cancelled: "bg-red-500 text-white",
    completed: "bg-green-600 text-white", // adjusted green color
    Missed: "bg-yellow-500 text-gray-800",
  };

  // Handler for "Open Slot" button click: call createDoctorSchedule with the date
  const handleOpenSlot = async (dateStr) => {
    try {
      await createDoctorSchedule(dateStr);
      // Optionally, re-fetch the schedules after creation:
      const updatedData = await fetchDoctorScheduleByDate(dateStr);
      setSchedules((prev) => ({ ...prev, [dateStr]: updatedData }));
    } catch (error) {
      console.error("Error creating schedule slots:", error);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Schedule</h2>

      {/* Header Row: Dates aside the time columns */}
      <div className="flex border-b pb-2">
        {/* Date label placeholder column */}
        <div className="w-[100px] flex-shrink-0"></div>
        {times.map((time) => (
          <div
            key={time}
            className="w-[80px] flex-shrink-0 text-center text-xs text-gray-500"
          >
            {time}
          </div>
        ))}
      </div>

      {/* Schedule rows for each date */}
      {datesToShow.map((dateStr) => (
        <div key={dateStr} className="flex items-center border-b h-12 relative">
          {/* Display the date */}
          <div className="w-[100px] flex-shrink-0 font-semibold text-gray-700">
            {dateStr}
          </div>

          {/* Slots container */}
          <div className="relative flex-grow h-12">
            {schedules[dateStr] && schedules[dateStr].length > 0 ? (
              schedules[dateStr].map((slot) => {
                const [startHour, startMin] = slot.slot.startTime.split(":").map(Number);
                const [endHour, endMin] = slot.slot.endTime.split(":").map(Number);
                const slotStart = startHour * 60 + startMin;
                const slotEnd = endHour * 60 + endMin;

                // Calculate left offset and slot width
                const leftOffset = ((slotStart - scheduleStart) / 15) * slotWidth;
                const width = ((slotEnd - slotStart) / 15) * slotWidth;

                // Find matching appointment (if any)
                const matchingAppointment = appointments.find(
                  (appt) =>
                    appt.scheduleId &&
                    appt.scheduleId.scheduleId === slot.scheduleId
                );

                let displayText = "";
                let slotClasses =
                  "absolute top-0 h-8 rounded px-2 flex items-center text-sm whitespace-nowrap overflow-hidden";

                if (matchingAppointment) {
                  const status = matchingAppointment.status;
                  const colorClass =
                    appointmentColors[status] || "bg-gray-300 text-gray-700";
                  slotClasses += ` ${colorClass}`;
                  displayText =
                    matchingAppointment.patient?.username || "Booked";
                } else {
                  if (!slot.booked) {
                    slotClasses += " bg-green-100 text-green-700";
                    displayText = "Available";
                  } else {
                    slotClasses += " bg-gray-400 text-white";
                    displayText = `${slot.slot.startTime} - ${slot.slot.endTime}`;
                  }
                }

                return (
                  <div
                    key={slot.scheduleId}
                    className={slotClasses}
                    style={{
                      left: `${leftOffset}px`,
                      width: `${width - gap}px`,
                    }}
                  >
                    {displayText}
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleOpenSlot(dateStr)}
                >
                  Open Slot
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
