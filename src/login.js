

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import img from "./images/doctorPatient.jpg";

// export default function Login() {
//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleLoginSubmit = (event) => {
//     event.preventDefault();
//     // Handle login submission logic here, e.g., verify credentials with backend
//     console.log("Form submitted with:", { name, phoneNumber, password });
//     // Reset form fields after submission if needed
//     setName("");
//     setPhoneNumber("");
//     setPassword("");
//     // Redirect to desired page after successful login
//     navigate("/patient/home/PatientHome"); // Example redirect to '/dashboard'
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === "name") {
//       setName(value);
//     } else if (name === "phoneNumber") {
//       setPhoneNumber(value);
//     } else if (name === "password") {
//       setPassword(value);
//     }
//   };

//   return (
//     <div className="h-screen lg:h-screen bg-[#eef8f6] w-full flex flex-row justify-center items-center relative">
//       <div>
//         <Link
//           to="/"
//           className="flex items-center space-x-3 rtl:space-x-reverse absolute top-5 left-10 z-10"
//         >
//           <img
//             src="https://flowbite.com/docs/images/logo.svg"
//             className="h-6 md:h-8"
//             alt="Flowbite Logo"
//           />
//           <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white sm:text-2xl landscape:text-lg">
//             Website
//           </span>
//         </Link>
//       </div>
//       <div className="flex flex-col-reverse lg:flex-row items-center justify-center h-screen md:h-full lg:h-[80vh] w-full lg:w-5/6 lg:bg-[#aadcd2] lg:rounded-[2rem] md:mt-12 lg:mt-0 lg:shadow-2xl overflow-hidden">
//         <div className="hidden md:block h-1/2 lg:h-full w-full lg:w-5/12">
//           <img className="h-full w-full" src={`${img}`}/>
//         </div>
//         {/* Partition */}
//         <div className="hidden lg:block border-s border-[#2BA78F] h-[60vh]"></div>
//         {/* Partition */}
//         <div className="h-full md:h-[60vh] w-3/4 lg:w-7/12 lg:h-full lg:w-1/2 flex flex-col justify-center md:p-12 gap-y-15">
//           <div className="w-full">
//             <h1 className="font-custom text-[2rem] lg:text-2xl text-[#0a2822]">
//               Login
//             </h1>
//             <hr className="w-1/12 border-t-4 border-[#2BA78F] mb-4" />
//             <p className="text-md text-[#0a2822]">
//               Welcome Back, Please enter your details to login{" "}
//             </p>
//           </div>
//           <div className="p-2 h-[60vh] lg:p-4 md:h-5/6 w-full lg:h-2/3 mt-4 md:mt-0 shadow-md rounded-lg lg:rounded-md w-full flex-1 bg-[#aadcd2] flex flex-col justify-center">
//             <form
//               onSubmit={handleLoginSubmit}
//               className="w-full flex flex-col justify-center items-center gap-y-6 py-3 lg:py-8"
//             >
//               <div className="w-full flex flex-row flex-wrap justify-center gap-4 lg:gap-x-8">
//                 <input
//                   id="nameInput"
//                   type="text"
//                   name="name"
//                   className="w-full md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
//                   placeholder="Enter your name"
//                   value={name}
//                   onChange={handleChange}
//                   required
//                 />
//                 <input
//                   id="phoneNumberInput"
//                   type="tel"
//                   name="phoneNumber"
//                   className="w-full md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
//                   placeholder="Enter your phone number"
//                   value={phoneNumber}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="w-full flex flex-row flex-wrap justify-center gap-4 lg:gap-x-8">
//                 <input
//                   id="passwordInput"
//                   type="password"
//                   name="password"
//                   className="w-full md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="inline font-semibold py-3 px-6 text-lg bg-[#228672] text-white rounded-full hover:bg-[#1a6456] focus:outline-none"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//           <div className="flex flex-row justify-end px-4 py-2">
//             <p className="text-md items-center justify-center">
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="text-[#1a6456] underline hover:text-[#1a6456]"
//               >
//                 Create a new account
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// colors: 
// #a3c1ad
// #98FBCB
// #92E4AF
// #a0d6b4
// dark
// #00A86B
// (#14AC97)
// #2BA78F
// #016B69
import React, { useState } from 'react';
import DoctorLogin from './doctor/Login';
import LoginStaff from "./staff/login";
import img from "./images/doctorPatient.jpg";
import {Link} from "react-router-dom";
import PatientLogin from './patient/login';
export default function Register() {
    const [selectedOption, setSelectedOption] = useState('Patient');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="min-h-screen bg-[#f0f4f7] flex flex-col justify-center items-center">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center w-full lg:w-5/6 bg-white lg:bg-[#eef8f6] lg:rounded-2xl shadow-lg overflow-hidden">
                <div className="hidden lg:block lg:w-1/2">
                    <img className="h-full w-full object-cover" src={img} alt="Doctor and Patient" />
                </div>
                {/* Divider */}
                <div className="hidden lg:block border-l border-[#2BA78F] h-full"></div>
                {/* Form Section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 lg:px-12 py-8 lg:py-12 bg-white">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6 pt-4 lg:pt-0">Login Now</h1>
                    <p className="text-md lg:text-lg mb-4">Select your role to login:</p>
                    <div className="flex justify-center lg:justify-start mb-4 lg:mb-6 space-x-2 lg:space-x-4">
                        <button
                            className={`py-2 px-4 lg:px-6 rounded-full text-sm lg:text-lg font-semibold transition-all duration-300 ${selectedOption === 'Doctor' ? 'bg-[#2BA78F] text-white shadow-lg' : 'bg-white text-[#2BA78F] border border-[#2BA78F]'}`}
                            onClick={() => handleOptionChange('Doctor')}
                        >
                            Doctor
                        </button>
                        <button
                            className={`py-2 px-4 lg:px-6 rounded-full text-sm lg:text-lg font-semibold transition-all duration-300 ${selectedOption === 'Patient' ? 'bg-[#2BA78F] text-white shadow-lg' : 'bg-white text-[#2BA78F] border border-[#2BA78F]'}`}
                            onClick={() => handleOptionChange('Patient')}
                        >
                            Patient
                        </button>
                        <button
                            className={`py-2 px-4 lg:px-6 rounded-full text-sm lg:text-lg font-semibold transition-all duration-300 ${selectedOption === 'Staff' ? 'bg-[#2BA78F] text-white shadow-lg' : 'bg-white text-[#2BA78F] border border-[#2BA78F]'}`}
                            onClick={() => handleOptionChange('Staff')}
                        >
                            Staff
                        </button>
                    </div>
                    <div className="p-4 lg:p-6 bg-gray-50 rounded-lg shadow-md">
                        {selectedOption === 'Doctor' && <DoctorLogin />}
                        {selectedOption === 'Patient' && <PatientLogin />}
                        {selectedOption === 'Staff' && <LoginStaff />}
                    </div>
                    <div className="mt-4 lg:mt-6 text-center lg:text-right">
                        <p className="pb-4 lg:pb-6 text-gray-700">Don't have an account? <Link to="/register" className="text-[#2BA78F] font-semibold underline">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
