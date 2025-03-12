import React, { useState } from 'react';
// import PatientSignUp from "./patient/signup";
// import DoctorSignUp from "./doctor/signup";
// import StaffSignUp from "./staff/signup";
import img from "./images/doctorPatient.jpg";
import { Link } from "react-router-dom";
import DoctorSignUp from './pages/doctor/signup';
import StaffSignUp from './pages/staff/signup';
import PatientSignUp from './pages/patient/signup';


export default function Register() {
    const [selectedOption, setSelectedOption] = useState('Option 2');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-[#e2f4f3] to-[#eef8f6]">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center w-full lg:w-4/5 bg-white shadow-2xl rounded-lg overflow-hidden">
                <div className="hidden lg:block lg:w-1/2">
                    <img className="object-cover h-full w-full" src={img} alt="Doctor and Patient"/>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 bg-[#f3faf9]">
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#10443d] mb-4">Register Now</h1>
                    <hr className="w-1/6 border-t-4 border-[#2BA78F] mb-6"/>
                    <p className="text-lg text-[#10443d] mb-4">Who do you want to register as?</p>
                    <div className="flex space-x-4 mb-6">
                        {/* <button
                            className={`py-2 px-4 rounded-full text-lg font-semibold focus:outline-none transition-colors ${selectedOption === 'Option 1' ? 'bg-[#2BA78F] text-white shadow-lg' : 'bg-white text-[#2BA78F] border border-[#2BA78F] hover:bg-[#e6f7f4]'}`}
                            onClick={() => handleOptionChange('Option 1')}
                        >
                            Doctor
                        </button> */}
                        <button
                            className={`py-2 px-4 rounded-full text-lg font-semibold focus:outline-none transition-colors ${selectedOption === 'Option 2' ? 'bg-[#2BA78F] text-white shadow-lg' : 'bg-white text-[#2BA78F] border border-[#2BA78F] hover:bg-[#e6f7f4]'}`}
                            onClick={() => handleOptionChange('Option 2')}
                        >
                            Patient
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-500 ease-in-out">
                        {selectedOption === 'Option 1' && <DoctorSignUp />}
                        {selectedOption === 'Option 2' && <PatientSignUp />}
                        {selectedOption === 'Option 3' && <StaffSignUp />}
                    </div>
                    <div className="flex justify-end mt-6">
                        <p className="text-sm text-[#10443d]">
                            Already have an account? <Link to="/login" className="text-[#2BA78F] font-semibold underline hover:text-[#10443d]">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
