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
import PatientSignUp from "./patient/signup";
import DoctorSignUp from "./doctor/signup";
import StaffSignUp from "./staff/signup";
import img from "./images/doctorPatient.jpg";
import {Link} from "react-router-dom";

export default function Register(){
    const [selectedOption, setSelectedOption] = useState('Option 2');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };
    return (
        <div class="h-100vh lg:h-[100vh] bg-[#eef8f6] w-full flex flex-row justify-center items-center relative">
            <div>
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse absolute top-5 left-10 z-10">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 md:h-8 " alt="Flowbite Logo" />
                    <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white sm:text-2xl landscape:text-lg">Flowbite</span>
                </a>
            </div>
            <div class="flex flex-col-reverse lg:flex-row items-center justify-center h-[100vh] md:h-full lg:h-[80vh] w-full lg:w-5/6 lg:bg-[#aadcd2] lg:rounded-[2rem] md:mt-12 lg:mt-0 lg:shadow-2xl overflow-hidden">
                <div class="hidden md:block h-1/2 lg:h-[60vh] w-full lg:h-full lg:w-5/12">
                    <img className="h-full w-full" src={`${img}`}/>
                </div>
                {/* Partition */}
                <div class="hidden lg:block border-s border-[#2BA78F] h-full"></div>
                {/* Partition */}
                <div class="h-full md:h-[60vh] w-3/4 lg:w-7/12 lg:h-full lg:w-1/2 flex flex-col justify-center md:p-12 gap-y-15 ">
                    <div class="w-full">
                        <h1 class="font-custom text-[2rem] lg:text-2xl text-[#0a2822]">Register Now</h1>
                        <hr class="w-1/6 border-t-4 border-[#2BA78F] mb-4"/>
                        <div class="flex w-full flex-col gap-y-2 items-start justify-center py-3">
                            <p class="text-lg md:text-xl lg:text-base">Who do you want to register as?</p>
                            <div class="w-full gap-x-6 flex flex-row justify-start items-center mb-4 ">
                                <button
                                    className={`p-2 lg:px-4 w-[6em] rounded-full font-semibold focus:outline-none ${selectedOption === 'Option 1' ? 'bg-white lg:bg-[#2BA78F] lg:text-white' : 'bg-[#2BA78F] text-white lg:text-black lg:bg-white'}`}
                                    onClick={() => handleOptionChange('Option 1')}
                                    style={{boxShadow: '0 0 5px rgba(34, 134, 114, 0.8)'}}
                                >
                                    Doctor
                                </button>
                                <button
                                    className={`p-2 lg:px-4 w-[6em] rounded-full font-semibold focus:outline-none ${selectedOption === 'Option 2' ? 'bg-white lg:bg-[#2BA78F] lg:text-white' : 'bg-[#2BA78F] text-white lg:text-black lg:bg-white'}`}
                                    onClick={() => handleOptionChange('Option 2')}
                                    style={{boxShadow: '0 0 5px rgba(34, 134, 114, 0.8)'}}
                                >
                                    Patient
                                </button>
                                <button
                                    className={`p-2 lg:px-4 w-[6em] rounded-full font-semibold focus:outline-none ${selectedOption === 'Option 3' ? 'bg-white lg:bg-[#2BA78F] lg:text-white' : 'bg-[#2BA78F] text-white lg:text-black lg:bg-white'}`}
                                    onClick={() => handleOptionChange('Option 3')}
                                    style={{boxShadow: '0 0 5px rgba(34, 134, 114, 0.8)'}}
                                >
                                    Staff
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 h-[60vh] lg:p-4 md:h-5/6 w-full lg:h-2/3 mt-4 md:mt-0 shadow-md rounded-lg lg:rounded-md w-full flex:1 bg-[#aadcd2] flex flex-col justify-center">
                        {selectedOption === 'Option 1' && <DoctorSignUp />}
                        {selectedOption === 'Option 2' && <PatientSignUp />}
                        {selectedOption === 'Option 3' && <StaffSignUp />}
                    </div>
                    <div className='flex flex-row justify-end px-4 py-2'><p>Already have an account? <span><Link to="/login" className='text-[#1a6456] font-semibold underline underline-offset-2'>Login</Link></span></p></div>
                </div>
            </div>
        </div>
    );
}