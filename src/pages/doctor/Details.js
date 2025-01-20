import React, { useEffect, useState } from 'react';
import { Link,useLocation, useNavigate } from "react-router-dom";
import img from '../../images/doctorPatient.jpg'; // Importing the image

export default function Details() {
    const [doctorRegister,setDoctorRegister] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state || {};
    useEffect(() => {
        setDoctorRegister(data);
    }, [data]);
    const [formData, setFormData] = useState({
        // doctorId: {
        //     "id": 1,
        //     "doctorName": "saisharan",
        //     "phoneNumber": "9959584192",
        //     "password": "Dhoni@2005",
        //     "email": "duginisaisharan@gmail.come",
        //     "doctorId": "D29sais4192",
        //     "doctorDetails": null
        //   },
  
        age: '',
        gender: '',
        address: '',
        city: '',
        pincode: '',
        consultationFee: '',
        specialization: '',
        remuneration: ''
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
            formData["doctorId"]= data.id
       

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/doctor/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Doctor details saved successfully!');
            } else {
                console.error('Failed to save doctor details');
            }
            navigate("/login")
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="h-100vh lg:h-[100vh] bg-[#eef8f6] w-full flex flex-row justify-center items-center relative">
           
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center h-[100vh] md:h-full lg:h-[80vh] w-full lg:w-5/6 lg:bg-[#aadcd2] lg:rounded-[2rem] md:mt-12 lg:mt-0 lg:shadow-2xl overflow-hidden">
                <div className="hidden md:block h-1/2 lg:h-[60vh] w-full lg:h-full lg:w-5/12">
                    <img className="h-full w-full" src={img} alt="Doctor and Patient" />
                </div>
                {/* Partition */}
                <div className="hidden lg:block border-s border-[#2BA78F] h-full"></div>
                {/* Partition */}
                <div className="h-full md:h-[60vh] w-3/4 lg:w-7/12 lg:h-full lg:w-1/2 flex flex-col justify-center md:p-12 gap-y-15 ">
                <h1 class="font-custom text-[2rem] lg:text-2xl text-[#0a2822]">Doctor Details</h1>

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
                            <input
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
                            />
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
