// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import PatientNavbar from "../../components/PatientNavbar";

// const UpdateAppointment = () => {
//   const { AppointmentId } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [bookingData, setBookingData] = useState({});
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const fetchAppointmentData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/bookingAppointments/byId/${AppointmentId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         const bookingData = await response.json();
//         console.log(bookingData)
        
//         setBookingData(bookingData);
//         setDoctor(bookingData.doctorId);
//         setSchedules(bookingData.scheduleId)
//         setIsLoading(false);
  
//       } catch (error) {
//         console.error("Failed to fetch appointment data:", error);
//       }
//     };

//     fetchAppointmentData();
//   }, [AppointmentId]);

//   const bookAppointment = async () => {
//     if (!selectedSchedule) {
//       console.error("No schedule selected");
//       return;
//     }

//     bookingData.scheduleId = selectedSchedule;

//     try {
//       const response = await fetch(`http://localhost:8080/bookingAppointments/${AppointmentId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingData),
//       });

//       if (response.ok) {
//         const responseData = await response.json();
//         console.log("Appointment updated successfully!", responseData);
//         navigate(`/token/${responseData.token}`);
//         // setSchedules((prevSchedules) =>
//         //   prevSchedules.map((sch) =>
//         //     sch.scheduleId === selectedSchedule.scheduleId ? { ...sch, booked: true } : sch
//         //   )
//         // );
//       } else {
//         console.error("Failed to update appointment");
//       }
//     } catch (error) {
//       console.error("Failed to update appointment:", error);
//     }
//   };

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":");
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     const options = { hour: "numeric", minute: "numeric", hour12: true };
//     return date.toLocaleTimeString([], options);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   // if (!doctor) {
//   //   return <div>Doctor not found</div>;
//   // }

//   return (
//     <>
     
//     <PatientNavbar/>
//     <div className="min-h-[90vh] bg-gray-50 flex flex-col items-center">
//       <main className="w-full max-w-3xl mt-8 p-4 bg-white shadow-md rounded-md">
//         <h1 className="text-2xl font-bold">{doctor.doctorName}</h1>

        

//         {doctor.doctorDetails && (
//             <>
//               <p className="text-[#2BA78F]">
//                 {doctor.doctorDetails.specialization || "Specialty not specified"}
//               </p>

//               <p className="">Phone Number : {doctor.phoneNumber}</p>
//               <p className="">Consultation Fee : {doctor.doctorDetails.consultationFee}</p>
//               <p className="">
//                 Address : {doctor.doctorDetails.address} {doctor.doctorDetails.city}
//               </p>
//             </>
//           )}
    
//         <div>
//           <h2 className="text-lg font-semibold mb-4">Select a time</h2>
//           <p className="mb-4">
//             {doctor.doctorName} is available for online booking on the following
//             dates and times:
//           </p>
//           <div className="flex justify-between border-b-2 mb-4">
//             <button className="pb-2 border-b-2 border-[#2BA78F]">
//               Thursday, Sep 30
//             </button>
//             <button className="pb-2">Friday, Oct 1</button>
//             <button className="pb-2">Saturday, Oct 2</button>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <h3 className="font-semibold mb-2">Morning</h3>
//               <div className="flex flex-wrap gap-2">
//                 {schedules
//                   .filter((schedule) => {
//                     const hour = parseInt(schedule.startTime.split(":")[0]);
//                     return hour >= 9 && hour < 12;
//                   })
//                   .map((schedule) => (
//                     <button
//                     onClick={() => setSelectedSchedule(schedule)}
//                     key={schedule.scheduleId}
//                     className={`px-4 py-2 rounded ${
//                       schedule.booked ? "bg-red-300" : "bg-green-400"
//                     } ${schedule === selectedSchedule ? "bg-blue-400" : ""}`}
//                     disabled={schedule.booked}
//                     >
//                       {formatTime(schedule.startTime)}
//                     </button>
//                   ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-2">Afternoon</h3>
//               <div className="flex flex-wrap gap-2">
//                 {schedules
//                   .filter((schedule) => {
//                     const hour = parseInt(schedule.startTime.split(":")[0]);
//                     return hour >= 12 && hour < 18;
//                   })
//                   .map((schedule) => (
//                     <button
//                     onClick={() => setSelectedSchedule(schedule)}
//                     key={schedule.scheduleId}
//                     className={`px-4 py-2 rounded ${
//                       schedule.booked ? "bg-red-300" : "bg-green-400"
//                     } ${schedule === selectedSchedule ? "bg-blue-400" : ""}`}
//                     disabled={schedule.booked}
//                     >
//                       {formatTime(schedule.startTime)}
//                     </button>
//                   ))}
//               </div>
//             </div>
//           </div>
//           <div className="mt-8">
//             Link
//             <button  className="w-full bg-[#2BA78F] text-white px-4 py-2 rounded">
//               Book an appointment
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//     </>
//   );
// };

// export default UpdateAppointment;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientNavbar from "../../components/PatientNavbar";

const UpdateAppointment = () => {
  const { AppointmentId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [scheduleId,setScheduleId] = useState();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState({});
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Fetch the schedules based on doctorId
  
  // }, [scheduleId]);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/bookingAppointments/byId/${AppointmentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const AppointmentDetails = await response.json();
        console.log(AppointmentDetails);
        
        setBookingData(AppointmentDetails);
        setDoctor(AppointmentDetails.doctorId);
        setScheduleId(AppointmentDetails.scheduleId?.scheduleId);
        console.log()
        setIsLoading(false);
        fetchSchedule(AppointmentDetails.doctorId.doctorId)

      } catch (error) {
        console.error("Failed to fetch appointment data:", error);
        setIsLoading(false);
      }
    };
    const fetchSchedule = async (schedule) => {
      try {
        const response = await fetch(`http://localhost:8080/schedule/doctor/${schedule}`);
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
        setIsLoading(false);
      }
    };

    
    fetchAppointmentData();
  }, [AppointmentId]);

  const updateAppoinment = async () => {
    if (!selectedSchedule) {
      console.error("No schedule selected");
      return;
    }

    bookingData.scheduleId = selectedSchedule;

    try {
      const response = await fetch(`http://localhost:8080/bookingAppointments/${AppointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Appointment updated successfully!", responseData);
        navigate(`/token/${responseData.token}`);
        setSchedules((prevSchedules) =>
          prevSchedules.map((sch) =>
            sch.scheduleId === selectedSchedule.scheduleId ? { ...sch, booked: true } : sch
          )
        );
      } else {
        console.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString([], options);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (schedules!={}) {
  //   console.log(doctor)
  //   console.log(schedules)

  //   return <div>Doctor not found</div>;
  // }

  return (
    <>
      
      <PatientNavbar/>
    <div className="min-h-[90vh] bg-gray-50 flex flex-col items-center">
      <main className="w-full max-w-3xl mt-8 p-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold">{doctor.doctorName}</h1>

        

        {doctor.doctorDetails && (
            <>
              <p className="text-[#2BA78F]">
                {doctor.doctorDetails.specialization || "Specialty not specified"}
              </p>

              <p className="">Phone Number : {doctor.phoneNumber}</p>
              <p className="">Consultation Fee : {doctor.doctorDetails.consultationFee}</p>
              <p className="">
                Address : {doctor.doctorDetails.address} {doctor.doctorDetails.city}
              </p>
            </>
          )}
    
        <div>
          <h2 className="text-lg font-semibold mb-4">Select a time</h2>
          <p className="mb-4">
            {doctor.doctorName} is available for online booking on the following
            dates and times:
          </p>
          <div className="flex justify-between border-b-2 mb-4">
            <button className="pb-2 border-b-2 border-[#2BA78F]">
              Thursday, Sep 30
            </button>
            <button className="pb-2">Friday, Oct 1</button>
            <button className="pb-2">Saturday, Oct 2</button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Morning</h3>
              <div className="flex flex-wrap gap-2">
                {schedules
                  .filter((schedule) => {
                    const hour = parseInt(schedule.startTime.split(":")[0]);
                    return hour >= 9 && hour < 12;
                  })
                  .map((schedule) => (
                    <button
                    onClick={() => setSelectedSchedule(schedule)}
                    key={schedule.scheduleId}
                    className={`px-4 py-2 rounded ${
                      schedule.booked ? "bg-red-300" : "bg-green-400"
                    } ${schedule === selectedSchedule ? "bg-blue-400" : ""}`}
                    disabled={schedule.booked}
                    >
                      {formatTime(schedule.startTime)}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Afternoon</h3>
              <div className="flex flex-wrap gap-2">
                {schedules
                  .filter((schedule) => {
                    const hour = parseInt(schedule.startTime.split(":")[0]);
                    return hour >= 12 && hour < 18;
                  })
                  .map((schedule) => (
                    <button
                    onClick={() => setSelectedSchedule(schedule)}
                    key={schedule.scheduleId}
                    className={`px-4 py-2 rounded ${
                      schedule.booked ? "bg-red-300" : "bg-green-400"
                    } ${schedule === selectedSchedule ? "bg-blue-400" : ""}`}
                    disabled={schedule.booked}
                    >
                      {formatTime(schedule.startTime)}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button  onClick = {updateAppoinment}className="w-full bg-[#2BA78F] text-white px-4 py-2 rounded">
              Book an appointment
            </button>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default UpdateAppointment;
