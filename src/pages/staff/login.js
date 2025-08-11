import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiService from "../../utils/api";


export default function LoginStaff() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    // name: "",
    phoneNumber: "",
    // email: "",
    password: "",
  });

  const onChange = (event) => {
    if (event.target) {
      setCredentials({
        ...credentials,
        [event.target.name]: event.target.value,
      });
    }
  };


  const registerDoctor = async () => {
    const data = {
      // doctorName: credentials.name,
      phoneNumber: credentials.phoneNumber,
      email: credentials.email,
      password: credentials.password
    };
  
    try {
      const responseData = await apiService.post('/auth/login', data);
      localStorage.setItem("staffId",responseData.id)
      localStorage.setItem("role",responseData.role)

      console.log('Doctor registered successfully:', responseData);
      navigate('/staff/home');

      // Handle success, maybe redirect or show a success message
      return {
        "status":"success",
        "message":"Registered Succesfully "

      } 
       } catch (error) {
      console.error('Error registering doctor:', error.message);
      // Handle error, show an error message or log the error
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here, e.g., sending data to backend, storing in state, etc.
    console.log("Form submitted with:", credentials);
    // // Reset form fields after submission if needed
    // setCredentials({
    //     name: '',
    //     phoneNumber: '',
    //     email: '',
    //     password: '',
    // });
    registerDoctor();



  };

  return (
    <form
      className="w-full flex flex-col justify-center items-center gap-y-6 py-3 lg:py-8"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-row flex-wrap justify-center gap-4 lg:gap-x-8">
        {/* <input
          id="nameInput"
          type="text"
          name="name"
          className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
          placeholder="Enter your name"
          value={credentials.name}
          onChange={onChange}
          required
        /> */}
        <input
          id="phoneNumberInput"
          type="number"
          name="phoneNumber"
          className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
          placeholder="+91 Enter your number"
          value={credentials.phoneNumber}
          onChange={onChange}
          required
        />

        {/* <input
          id="emailInput"
          type="email"
          name="email"
          className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
          placeholder="Enter your email"
          value={credentials.email}
          onChange={onChange}
          required
        /> */}
        <input
          id="passwordInput"
          type="text"
          name="password"
          className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
          placeholder="Enter the password"
          value={credentials.password}
          onChange={onChange}
          required
        />
      </div>
      <button
        type="submit"
        onClick={registerDoctor}
        className="inline font-semibold py-3 px-6 text-lg bg-[#228672] text-white rounded-full hover:bg-[#1a6456] focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
}
