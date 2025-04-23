// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import PatientNavbar from "../components/PatientNavbar";
// const AppointmentBooking = () => {
//   const { doctorId } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate()

//   useEffect(() => {
//     // Fetch the doctor data based on doctorId
//     const fetchDoctorData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/doctor/byId/${doctorId}`
//         );
//         const data = await response.json();
//         setDoctor(data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch doctor data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchDoctorData();
//   }, [doctorId]);

//   const getPatientDetail = async (patientId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/patient/${patientId}`);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Failed to fetch patient data:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     // Fetch the schedules based on doctorId
//     const fetchSchedule = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/schedule/doctor/${doctorId}`);
//         const data = await response.json();
//         setSchedules(data);
//       } catch (error) {
//         console.error("Failed to fetch schedule data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchSchedule();
//   }, [doctorId]);

//   const BookAppointment = async () => {
//     if (!selectedSchedule) {
//       console.error("No schedule selected");
//       return;
//     }

//     const patientDetail = await getPatientDetail(localStorage.getItem("patientId"));
//     if (!patientDetail) {
//       console.error("Failed to fetch patient detail");
//       return;
//     }

//     const data = {
//       doctorId: doctor,
//       patientId: patientDetail,
//       scheduleId: selectedSchedule,
//       // token: "klajlgk", // Ensure to replace this with an actual token or logic to generate one
//     };

//     try {
//       const response = await fetch("http://localhost:8080/bookingAppointments", {
//         method: "POST",
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data),
//       });
      
//       if (response.ok) {
//         const responseData = await response.json();







//         const sendEmail = async () => {
//           try {
//             const response = await fetch(`http://localhost:8080/sendEmail?Token=${responseData.token}`);
//             if (!response.ok) {
//               throw new Error('Failed to send email');
//             }
//             const data = await response.text();
//             console.log(data); // Log success message
//             alert('Email sent successfully!');
//           } catch (error) {
//             console.error('Error sending email:', error);
//             alert('Failed to send email. Please try again later.');
//           }
//         };
//         sendEmail()
//         console.log("Appointment booked successfully!" +responseData);
//         // console.log(responseData)
//         navigate( `/token/${responseData.token}`)
//         // Optionally update the schedule state to reflect the booked appointment
//         setSchedules((prevSchedules) =>
//           prevSchedules.map((sch) =>
//             sch.scheduleId === selectedSchedule.scheduleId ? { ...sch, booked: true } : sch
//           )
//         );
//       } else {
//         console.error("Failed to book appointment");
//       }
      

//     } catch (error) {
//       console.error("Failed to book appointment:", error);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!doctor) {
//     return <div>Doctor not found</div>;
//   }

//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(":");
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     const options = { hour: "numeric", minute: "numeric", hour12: true };
//     return date.toLocaleTimeString([], options);
//   };

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
//             <button onClick={BookAppointment} className="w-full bg-[#2BA78F] text-white px-4 py-2 rounded">
//               Book an appointment
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
// </>
//   );
// };

// export default AppointmentBooking;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientNavbar from "../../components/navbar/PatientNavbar";

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch the doctor data based on doctorId
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL+`/doctor/byId/${doctorId}`
        );
        const data = await response.json();
        setDoctor(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  // const getPatientDetail = async (patientId) => {
  //   try {
  //     const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/patient/${patientId}`);
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Failed to fetch patient data:", error);
  //     return null;
  //   }
  // };

  useEffect(() => {
    // Fetch the schedules based on doctorId
    const fetchSchedule = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/schedule/doctor/${doctorId}`);
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [doctorId]);

  const BookAppointment = async () => {
    if (!selectedSchedule) {
      console.error("No schedule selected");
      return;
    }

    // const patientDetail = await getPatientDetail(localStorage.getItem("patientId"));
    // if (!patientDetail) {
    //   console.error("Failed to fetch patient detail");
    //   return;
    // }

    const data = {
      doctorId: doctor.id,
      // patientId: patientDetail,
      scheduleId: selectedSchedule.scheduleId,
      status: "Upcoming"

      // token: "klajlgk", // Ensure to replace this with an actual token or logic to generate one
    };

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/bookingAppointments", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("Token")}`, // Retrieve token from local storage

        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const responseData = await response.json();

        const sendEmail = async () => {
          try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/sendEmail?Token=${responseData.token}`);
            if (!response.ok) {
              throw new Error('Failed to send email');
            }
            const data = await response.text();
            console.log(data); // Log success message
            alert('Email sent successfully!');
          } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again later.');
          }
        };
        sendEmail()
        console.log("Appointment booked successfully!" +responseData);
        navigate( `/patient/appointment/token/${responseData.token}`)
        // Optionally update the schedule state to reflect the booked appointment
        setSchedules((prevSchedules) =>
          prevSchedules.map((sch) =>
            sch.scheduleId === selectedSchedule.scheduleId ? { ...sch, booked: true } : sch
          )
        );
      } else {
        console.error("Failed to book appointment");
      }
      

    } catch (error) {
      console.error("Failed to book appointment:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString([], options);
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const date = schedule.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {});

  return (
    <>
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
            {Object.keys(groupedSchedules).length === 0 ? (
              <p>No appointments available</p>
            ) : (
              Object.keys(groupedSchedules).map((date) => (
                <div key={date}>
                  <h3 className="font-semibold mb-2">{formatDate(date)}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Morning</h4>
                      <div className="flex flex-wrap gap-2">
                        {groupedSchedules[date]
                          .filter((schedule) => {
                            const hour = parseInt(schedule.startTime.split(":")[0]);
                            return hour >= 9 && hour < 12;
                          })
                          .map((schedule) => (
                            <button
                              onClick={() => setSelectedSchedule(schedule)}
                              key={schedule.scheduleId}
                              className={`px-4 py-2 rounded ${schedule === selectedSchedule ? "bg-green-600 text-white" : ""}   ${
                                schedule.booked ? "bg-red-300" : "bg-green-400"
                              }  `}
                              disabled={schedule.booked}
                            >
                              {formatTime(schedule.startTime)}
                            </button>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Afternoon</h4>
                      <div className="flex flex-wrap gap-2">
                        {groupedSchedules[date]
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
                </div>
              ))
            )}
            <div className="mt-8">
              <button onClick={BookAppointment} className="w-full bg-[#2BA78F] text-white px-4 py-2 rounded">
                Book an appointment
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AppointmentBooking;
