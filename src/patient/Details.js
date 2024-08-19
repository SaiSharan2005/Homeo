import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import img from '../images/doctorPatient.jpg'; // Importing the image

export default function PatientDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state || {};
    const [formData, setFormData] = useState({
        patientId: '',
        age: '',
        gender: '',
        address: '',
        city: '',
        pincode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData["patientId"] = data.patientId

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/patient/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Doctor details saved successfully!');
                navigate("/login")
            } else {
                console.error('Failed to save doctor details');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="h-100vh lg:h-[100vh] bg-[#eef8f6] w-full flex flex-row justify-center items-center relative">
            <div>
                {/* <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse absolute top-5 left-10 z-10">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 md:h-8" alt="Flowbite Logo" />
                    <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white sm:text-2xl landscape:text-lg">Flowbite</span>
                </a> */}
            </div>
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center h-[100vh] md:h-full lg:h-[80vh] w-full lg:w-5/6 lg:bg-[#aadcd2] lg:rounded-[2rem] md:mt-12 lg:mt-0 lg:shadow-2xl overflow-hidden">
                <div className="hidden md:block h-1/2 lg:h-[60vh] w-full lg:h-full lg:w-5/12">
                    <img className="h-full w-full" src={img} alt="Doctor and Patient" />
                </div>
                {/* Partition */}
                <div className="hidden lg:block border-s border-[#2BA78F] h-full"></div>
                {/* Partition */}
                <div className="h-full md:h-[60vh] w-3/4 lg:w-7/12 lg:h-full lg:w-1/2 flex flex-col justify-center md:p-12 gap-y-15 ">
                    <form
                        className="w-full flex flex-col justify-center items-center gap-y-6 py-3 lg:py-8"
                        onSubmit={handleSubmit}
                    >
                        <div className="w-full flex flex-row flex-wrap justify-center gap-4 lg:gap-x-8">
                            {/* <input
                                id="doctorIdInput"
                                type="text"
                                name="doctorId"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Doctor ID"
                                value={formData.doctorId}
                                onChange={handleInputChange}
                                required
                            /> */}
                            <input
                                id="ageInput"
                                type="number"
                                name="age"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Age"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="genderInput"
                                type="text"
                                name="gender"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="addressInput"
                                type="text"
                                name="address"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="cityInput"
                                type="text"
                                name="city"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="pincodeInput"
                                type="text"
                                name="pincode"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                required
                            />
                            {/* <input
                                id="consultationFeeInput"
                                type="number"
                                name="consultationFee"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Consultation Fee"
                                value={formData.consultationFee}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="specializationInput"
                                type="text"
                                name="specialization"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Specialization"
                                value={formData.specialization}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="remunerationInput"
                                type="number"
                                name="remuneration"
                                className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
                                placeholder="Enter Remuneration"
                                value={formData.remuneration}
                                onChange={handleInputChange}
                                required
                            /> */}
                        </div>
                        <button
                            type="submit"
                            className="inline font-semibold py-3 px-6 text-lg bg-[#228672] text-white rounded-full hover:bg-[#1a6456] focus:outline-none"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
