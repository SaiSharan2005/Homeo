import React, { useState } from "react";

export default function StaffSignUp() {
  const [credentials, setCredentials] = useState({
    name: "",
    phoneNumber: "",
    email: "",
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
  };

  return (
    <form
      className="w-full flex flex-col justify-center items-center gap-y-6 py-3 lg:py-8"
      onSubmit={handleSubmit}
    >ertghyjukmnbvfgth
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
        className="inline font-semibold py-3 px-6 text-lg bg-[#228672] text-white rounded-full hover:bg-[#1a6456] focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
}
