import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import img from '../../images/doctorPatient.jpg'; // Importing the image

export default function PatientDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    // const { data } = location.state || {};
    const [formData, setFormData] = useState({
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
        // formData["patientId"] = data.patientId

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/patient/CreateProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("Token")}`
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                console.log('Patient details saved successfully!');
                navigate("/login")
            } else {
                console.error('Failed to save patient details');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-h-[90vh] overflow-auto bg-[#eef8f6] w-full flex justify-center items-center relative">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center h-full w-full lg:w-5/6 lg:bg-[#aadcd2] lg:rounded-[2rem] md:mt-8 lg:mt-0 lg:shadow-2xl overflow-hidden">
                <div className="hidden md:block h-1/2 lg:h-[60vh] w-full lg:h-full lg:w-5/12">
                    <img className="h-full w-full object-cover" src={img} alt="Doctor and Patient" />
                </div>
                {/* Divider */}
                <div className="hidden lg:block border-s border-[#2BA78F] h-full"></div>
                {/* Form Section */}
                <div className="h-full md:h-[60vh] w-3/4 lg:w-7/12 lg:h-full lg:w-1/2 flex flex-col justify-center md:p-4 lg:p-6 gap-y-2">
                    <form
                        className="w-full flex flex-col justify-center items-center gap-y-2 py-2"
                        onSubmit={handleSubmit}
                    >
                        <div className="w-full flex flex-row flex-wrap justify-center gap-2 lg:gap-x-3">
                            <input
                                id="ageInput"
                                type="number"
                                name="age"
                                className="w-11/24 md:w-5/12 px-3 py-2 mb-1 text-md border rounded-xl"
                                placeholder="Enter Age"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="genderInput"
                                type="text"
                                name="gender"
                                className="w-11/24 md:w-5/12 px-3 py-2 mb-1 text-md border rounded-xl"
                                placeholder="Enter Gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="addressInput"
                                type="text"
                                name="address"
                                className="w-11/24 md:w-5/12 px-3 py-2 mb-1 text-md border rounded-xl"
                                placeholder="Enter Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="cityInput"
                                type="text"
                                name="city"
                                className="w-11/24 md:w-5/12 px-3 py-2 mb-1 text-md border rounded-xl"
                                placeholder="Enter City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="pincodeInput"
                                type="text"
                                name="pincode"
                                className="w-11/24 md:w-5/12 px-3 py-2 mb-1 text-md border rounded-xl"
                                placeholder="Enter Pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline font-semibold py-2 px-4 text-lg bg-[#228672] text-white rounded-full hover:bg-[#1a6456] focus:outline-none"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
