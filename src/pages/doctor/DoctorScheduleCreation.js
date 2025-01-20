// import React, { useState, useEffect } from "react";
// import { format, addMinutes, parse } from "date-fns";
// import DoctorNavbar from "../components/DoctorNavbar";
// import { fetchDoctorById } from "../utils/doctorService";
// const DoctorScheduleCreation = () => {
//   const [startTime, setStartTime] = useState("9:00 AM");
//   const [endTime, setEndTime] = useState("5:00 PM");
//   const [timeGap, setTimeGap] = useState("15 minutes");
//   const [schedules, setSchedules] = useState([]);

//   // Function to generate time slots based on start time, end time, and time gap
//   const generateSlots = () => {
//     const slots = [];
//     let current = parse(startTime, "h:mm a", new Date());
//     const end = parse(endTime, "h:mm a", new Date());
//     const gap = parseInt(timeGap.split(" ")[0]); // Correctly parse the timeGap

//     while (current < end) {
//       slots.push(format(current, "HH:mm"));
//       current = addMinutes(current, gap);
//     }

//     setSchedules(slots);
//   };

//   // Call generateSlots when startTime, endTime, or timeGap changes
//   useEffect(() => {
//     generateSlots();
//   }, [startTime, endTime, timeGap]);

//   // Event handlers to update startTime, endTime, and timeGap
//   const handleStartTimeChange = (e) => setStartTime(e.target.value);
//   const handleEndTimeChange = (e) => setEndTime(e.target.value);
//   const handleTimeGapChange = (e) => setTimeGap(e.target.value);

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":");
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     const options = { hour: "numeric", minute: "numeric", hour12: true };
//     return date.toLocaleTimeString([], options);
//   };


//   function addMinutesToTime(timeString, minutesToAdd) {
//     // Split the time string into hours and minutes
//     var timeParts = timeString.split(':');
//     var hours = parseInt(timeParts[0]);
//     var minutes = parseInt(timeParts[1]);

//     // Create a new Date object with today's date and the specified time
//     var date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);

//     // Add minutes to the date object
//     date.setMinutes(date.getMinutes() + minutesToAdd);

//     // Format the new time
//     var newHours = date.getHours();
//     var newMinutes = date.getMinutes();

//     // Ensure hours and minutes are formatted correctly (adding leading zeros if necessary)
//     var formattedHours = (newHours < 10 ? '0' : '') + newHours;
//     var formattedMinutes = (newMinutes < 10 ? '0' : '') + newMinutes;

//     // Return the formatted time string
//     return formattedHours + ':' + formattedMinutes;
// }

//   const CreateSchedule = async()=>{

//   try {

//     // let data = []

//     const doctorData = await fetchDoctorById(localStorage.getItem("doctorId"));
//     console.log(localStorage.getItem("doctorId"))
//     const data = schedules.map((slot) => ({
//       doctorId: doctorData,
//       startTime: slot,
//       endTime: addMinutesToTime(slot,parseInt(timeGap.split(" ")[0]) ), // Adjust as needed, I assume you want the same start and end time for each slot
//       inUse: true,
//     }));

//     console.log(data)
//     const emptyTheSchedule = fetch("http://localhost:8080/doctor-timings/set-in-use-false",{
//       method:"POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(doctorData)
//     })
//     // Send schedules to backend
//     const response = await fetch("http://localhost:8080/doctor-timings/multi", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data), // Convert schedules array to JSON string
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create schedules");
//     }


//     console.log("Schedules created successfully");
//   } catch (error) {
//     console.error("Error creating schedules:", error);
//     // Handle error gracefully in your application
//   }

//   }

//   // Function to delete a slot
//   const handleDeleteSlot = (slot) => {
//     setSchedules(schedules.filter((s) => s !== slot));
//   };

//   return (
//     <>
//       <DoctorNavbar />
//       {/* {localStorage.getItem("doctorId")} */}
//       <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
//         <div className="layout-container flex flex-col">
//           <div className="gap-1 px-6 flex flex-1 justify-center py-5">
//             <div className="layout-content-container flex flex-col max-w-[920px] flex-1 max-h-[85vh]">
//               <div className="flex justify-between gap-3 p-4">
//                 <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-[240px]">
//                   Plan Your Day
//                 </p>
//               </div>
//               <div className="flex max-w-[480px] flex-1 flex-wrap items-end gap-4 px-4 py-3">
//                 <label className="flex flex-col min-w-[80px] flex-1">
//                   <p className="text-[#111418] text-base font-medium leading-normal pb-2">
//                     Start time
//                   </p>
//                   <input
//                     type="text"
//                     placeholder="9:00 AM"
//                     className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder-[#637588] p-4 text-base font-normal leading-normal"
//                     value={startTime}
//                     onChange={handleStartTimeChange}
//                   />
//                 </label>
//               </div>
//               <div className="flex max-w-[480px] flex-1 flex-wrap items-end gap-4 px-4 py-3">
//                 <label className="flex flex-col min-w-[80px] flex-1">
//                   <p className="text-[#111418] text-base font-medium leading-normal pb-2">
//                     End time
//                   </p>
//                   <input
//                     type="text"
//                     placeholder="5:00 PM"
//                     className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder-[#637588] p-4 text-base font-normal leading-normal"
//                     value={endTime}
//                     onChange={handleEndTimeChange}
//                   />
//                 </label>
//               </div>
//               <div className="flex max-w-[480px] flex-1 flex-wrap items-end gap-4 px-4 py-3">
//                 <label className="flex flex-col min-w-[80px] flex-1">
//                   <p className="text-[#111418] text-base font-medium leading-normal pb-2">
//                     Time gap between appointments
//                   </p>
//                   <input
//                     type="text"
//                     placeholder="15 minutes"
//                     className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder-[#637588] p-4 text-base font-normal leading-normal"
//                     value={timeGap}
//                     onChange={handleTimeGapChange}
//                   />
//                 </label>
//               </div>
//               <div className="flex justify-end">
//                 <div className="flex gap-3 flex-wrap px-4 py-3">
//                   <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-transparent text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">
//                     <span className="truncate">Cancel</span>
//                   </button>
//                   <button
//                     className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2887e6] text-white text-sm font-bold leading-normal tracking-[0.015em]"
//                     onClick={CreateSchedule}
//                   >
//                     <span className="truncate">Save</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="layout-content-container flex flex-col w-[360px]">
//               <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
//                 Visual representation
//               </h3>
//               <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
//                 {`${startTime} - ${endTime} with a ${timeGap} break`}
//               </p>
//               <div className="flex flex-col gap-2 px-4 h-[calc(100vh - 400px)] overflow-y-auto">
//                 {schedules.map((slot, index) => (
//                   <div key={index} className="flex items-center gap-2 pt-3">
//                     <div
//                       className="text-[#111418]"
//                       data-icon="Calendar"
//                       data-size="24px"
//                       data-weight="regular"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24px"
//                         height="24px"
//                         fill="currentColor"
//                         viewBox="0 0 256 256"
//                       >
//                         <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
//                       </svg>
//                     </div>
//                     <span className="bg-[#f0f2f4] text-[#111418] w-full rounded-lg h-10 flex items-center justify-center p-4 text-base font-normal leading-tight">
//                       {slot}
//                     </span>
//                     <button
//                       className="text-red-500"
//                       onClick={() => handleDeleteSlot(slot)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DoctorScheduleCreation;

import React, { useState, useEffect } from "react";
import { format, addMinutes, parse } from "date-fns";
import DoctorNavbar from "../../components/DoctorNavbar";
import { fetchDoctorById } from "../../utils/doctorService";

const DoctorScheduleCreation = () => {
  const [startTime, setStartTime] = useState("9:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");
  const [timeGap, setTimeGap] = useState("15 minutes");
  const [schedules, setSchedules] = useState([]);

  // Function to generate time slots based on start time, end time, and time gap
  const generateSlots = () => {
    const slots = [];
    let current = parse(startTime, "h:mm a", new Date());
    const end = parse(endTime, "h:mm a", new Date());
    const gap = parseInt(timeGap.split(" ")[0]);

    while (current < end) {
      slots.push(format(current, "HH:mm"));
      current = addMinutes(current, gap);
    }

    setSchedules(slots);
  };

  useEffect(() => {
    generateSlots();
  }, [startTime, endTime, timeGap]);

  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);
  const handleTimeGapChange = (e) => setTimeGap(e.target.value);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString([], options);
  };

  function addMinutesToTime(timeString, minutesToAdd) {
    var timeParts = timeString.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    var newHours = date.getHours();
    var newMinutes = date.getMinutes();
    var formattedHours = (newHours < 10 ? '0' : '') + newHours;
    var formattedMinutes = (newMinutes < 10 ? '0' : '') + newMinutes;
    return formattedHours + ':' + formattedMinutes;
  }

  const CreateSchedule = async () => {
    try {
      const doctorData = await fetchDoctorById(localStorage.getItem("doctorId"));
      const data = schedules.map((slot) => ({
        doctorId: doctorData,
        startTime: slot,
        endTime: addMinutesToTime(slot, parseInt(timeGap.split(" ")[0])),
        inUse: true,
      }));

      await fetch(process.env.REACT_APP_BACKEND_URL+"/doctor-timings/set-in-use-false", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/doctor-timings/multi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create schedules");
      }

      console.log("Schedules created successfully");
    } catch (error) {
      console.error("Error creating schedules:", error);
    }
  };

  const handleDeleteSlot = (slot) => {
    setSchedules(schedules.filter((s) => s !== slot));
  };

  return (
    <>
      <DoctorNavbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#00B4DB] to-[#0083B0] text-white">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Create Your Schedule</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <label className="block mb-4">
                <span className="text-xl font-semibold">Start Time</span>
                <input
                  type="text"
                  placeholder="9:00 AM"
                  className="mt-2 w-full bg-white text-black rounded-lg p-3 border-2"
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
              </label>
              <label className="block mb-4">
                <span className="text-xl font-semibold">End Time</span>
                <input
                  type="text"
                  placeholder="5:00 PM"
                  className="mt-2 w-full bg-white text-black rounded-lg p-3 border-2"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </label>
              <label className="block mb-6">
                <span className="text-xl font-semibold">Time Gap</span>
                <input
                  type="text"
                  placeholder="15 minutes"
                  className="mt-2 w-full bg-white text-black rounded-lg p-3 border-2"
                  value={timeGap}
                  onChange={handleTimeGapChange}
                />
              </label>
              <div className="flex justify-between">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={CreateSchedule}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Visual Representation</h3>
              <p className="mb-4">{`${startTime} - ${endTime} with a ${timeGap} slot`}</p>
              <div className="space-y-2">
                {schedules.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <span>{slot}</span>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteSlot(slot)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorScheduleCreation;
