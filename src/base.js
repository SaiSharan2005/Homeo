// // import React from "react";
// // import {useState,useRef, useEffect } from "react";
// // import image from "./images/image.jpg";
// // import {Link} from "react-router-dom"

// // const custom_shadow = {
// //     boxShadow: '1px 1px 100px rgba(36, 139, 119, 0.5)'
// // }

// // export default function Base(){
// //     const [isHovered, setIsHovered] = useState(false);
// //     const [isMenuOpen, setIsMenuOpen] = useState(false);
// //     const menuRef = useRef(null);

// //     const handleMouseEnter = () => {
// //     setIsHovered(true);
// //     };

// //     const handleMouseLeave = () => {
// //     setIsHovered(false);
// //     };
// //     const scrollToSection = (id) => {
// //         const element = document.getElementById(id);
// //         if (element) {
// //           element.scrollIntoView({ behavior: "smooth" });
// //         }
// //     };

// //     const handleToggleMenu = () => {
// //         setIsMenuOpen(!isMenuOpen);
// //     };

// //     const handleClickOutside = (event) => {
// //         if (menuRef.current && !menuRef.current.contains(event.target)) {
// //             setIsMenuOpen(false);
// //         }
// //     };

// //     useEffect(() => {
// //         document.addEventListener("mousedown", handleClickOutside);

// //         return () => {
// //             document.removeEventListener("mousedown", handleClickOutside);
// //         };
// //     }, []);
// //     return(
// //         <div className="relative">
// //             <div className="h-[100vh] mb-12 w-full">
// //             <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0">
// //                 <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 relative">
// //                 <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
// //                     {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
// //                     <h2 class = "text-white font-bold">Homeo</h2>
// //                     {/* <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white sm:text-2xl landscape:text-lg">Flowbite</span> */}
// //                 </a>
// //                 <div className="md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
// //                     <ul className="flex flex-row justify-center items-center lg:gap-x-6 md:gap-x-4 gap-x-2">
// //                         <li className="hidden sm:inline-flex">
// //                             <a href="./register" className="block p-4 font-medium py-2 px-3 text-base md:hover:text-[#2BA78F] md:p-0 md:dark:text-blue-500">Sign Up</a>
// //                         </li>
// //                         <li>
// //                             <Link to="./login"><button type="button" className="text-sm bg-transparent border-solid border-2 focus:outline-none text-[#2BA78F] border-[#2BA78F] font-bold rounded-full px-4 py-2 hover:bg-[#2BA78F] sm:px-6 sm:py-3 hover:text-white text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 landscape:py-2">LOGIN</button></Link>
// //                         </li>
// //                         <li>
// //                             <button
// //                             data-collapse-toggle="navbar-sticky"
// //                             type="button"
// //                             className="inline-flex items-center p-2 w-10 h-10 justify-center bg-transparent text-sm text-gray-500 rounded-lg md:hidden hover:bg-[#80cabc] focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
// //                             aria-controls="navbar-sticky"
// //                             aria-expanded={isMenuOpen}
// //                             onClick={handleToggleMenu}
// //                             >
// //                                 <span className="sr-only">Open main menu</span>
// //                                 <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
// //                                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
// //                                 </svg>
// //                             </button>
// //                         </li>
// //                     </ul>
// //                 </div>

// //                 <div className={`items-center justify-between ${isMenuOpen ? 'absolute top-12 right-4 w-1/2 xs:w-1/3 sm:w-1/3 block':'hidden'} md:flex md:w-auto md:order-1`} style={{zIndex:1000}} id="navbar-sticky"ref={menuRef}>
// //                     <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg bg-[#7cb9ad] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
// //                     <li>
// //                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section1")} aria-current="page">Home</button>
// //                     </li>
// //                     <li>
// //                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section2")}>About</button>
// //                     </li>
// //                     <li>
// //                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section3")}>Services</button>
// //                     </li>
// //                     <li>
// //                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section4")}>Contact</button>
// //                     </li>
// //                     </ul>
// //                 </div>
// //                 </div>
// //                 </nav>

// //             <div id="section1" className="absolute top-16 flex flex-col w-full gap-y-5 lg:gap-y-3 justify-center items-center md:top-18 md:mt-6 lg:mt-8">
// //                 {/* <span id="section1"></span> */}
// //                 <h1 className="w-4/5 font-custom text-3xl sm:w-5/6 md:w-3/4 lg:w-2/3 sm:text-4xl md:text-[2.75rem] text-center">
// //                     <span className="hidden sm:inline">
// //                         <span className="text-[#2BA78F]">Search for Doctors</span>, book appointments conveniently
// //                     </span>
// //                     <span className="sm:hidden">
// //                         <span className="text-[#2BA78F]">Book</span> Appointments conveniently
// //                     </span>
// //                 </h1>
// //                 <p className="w-1/2 text-center hidden sm:inline ">Lorem ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
// //                 <button
// //                 type="button"
// //                 className={`text-base font-custom bg-[#2BA78F] text-white rounded-full px-4 py-2 hover:bg-[#228672] hover:${custom_shadow} hover:shadow-[#228672] sm:px-6 sm:py-3 hover:text-white text-center`}
// //                 onClick={() => scrollToSection("section5")}
// //                 style = {{boxShadow: isHovered ? '1px 1px 100px rgba(36, 139, 119, 0.5)' : '1px 1px 0 rgba(36, 139, 119, 0)',
// //                     // transition: 'box-shadow 0.5s ease-in-out',
// //                 }}
// //                 onMouseEnter={handleMouseEnter}
// //                 onMouseLeave={handleMouseLeave}
// //                 >EXPLORE</button>
// //                 {/* <div className="w-2/3 h-[45vh] flex flex-col relative items-start mt-[5vh] md:mt-[7vh] lg:mt-[10vh]">
// //                     <div className="h-full aspect-square bg-[#2BA78F] z-50 absolute top-0 left-0 z-50 rounded-[2rem]"></div>
// //                     <div className="sm:block w-full h-[90vh] sm:h-[40vh] bg-[#AADCD2] rounded-[2rem] my-[2.5vh]"></div>
// //                 </div> */}
// //                 {/* <div className="w-2/3 h-[90vh] sm:h-[45vh] flex flex-col sm:flex-row items-center my-[4vh] md:my-[6vh] lg:my-[10vh]]">
// //                     <div className="h-[45vh] aspect-square bg-[#2BA78F] rounded-[2rem]"></div>
// //                     <div className="h-[40vh] w-[4/5] sm:w-[2/3] bg-[#AADCD2] rounded-[2rem]"></div>
// //                 </div> */}
// //                 <div className="relative w-[45vh] lg:w-2/3 h-[100vh] lg:h-[50vh] flex flex-col lg:flex-row items-center justify-center mt-[1.5vh]">
// //                     <div className="w-full aspect-[1/1] lg:w-[50vh] lg:h-[50vh] rounded-[2rem] bg-[#AADCD2] flex items-center justify-center">
// //                         <img className="aspect-[1/1] w-11/12 lg:h-11/12 rounded-[2rem]" src={`${image}`}/>
// //                     </div>
// //                     <div className="w-5/6 lg:flex-1 h-[55vh] lg:h-5/6 rectangle rounded-b-[2rem] lg:rounded-none lg:rounded-r-[2rem] bg-[#AADCD2]"></div>
// //                 </div>

// //             </div>
// //             </div>

// //             <div id="section5" className="flex flex-col items-center justify-center mt-12">
// //                 <h1 className="w-4/5 font-custom text-3xl sm:w-5/6 md:w-3/4 lg:w-2/3 sm:text-4xl md:text-[2.75rem] text-center">qwertyuiop sdfghjk</h1>
// //                 <div className="w-full"></div>
// //             </div>
// //             <div id="section2"></div>
// //             <div id="section3"></div>
// //             <div id="section4"></div>
// //         </div>
// //     );
// // }
// import React from "react";
// import { useState, useRef, useEffect } from "react";
// import image from "./images/image.jpg";
// import { Link } from "react-router-dom";
// import AdBanner from ".pages/patient/Adv";
// const custom_shadow = {
//   boxShadow: "1px 1px 100px rgba(36, 139, 119, 0.5)",
// };



// export default function Base() {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef(null);

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };
//   const scrollToSection = (id) => {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleToggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleClickOutside = (event) => {
//     if (menuRef.current && !menuRef.current.contains(event.target)) {
//       setIsMenuOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   return (
//     <div className="relative">
//       <div className="h-[100vh] mb-12 w-full">
//         <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0">
//           <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 relative">
//             <a
//               href="/"
//               className="flex items-center space-x-3 rtl:space-x-reverse"
//             >
//               <img
//                 src="https://flowbite.com/docs/images/logo.svg"
//                 className="h-8"
//                 alt="Flowbite Logo"
//               />
//               <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white sm:text-2xl landscape:text-lg">
//                 Flowbite
//               </span>
//             </a>
//             <div className="md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
//               <ul className="flex flex-row justify-center items-center lg:gap-x-6 md:gap-x-4 gap-x-2">
//                 <li className="hidden sm:inline-flex">
//                   <a
//                     href="./register"
//                     className="block p-4 font-medium py-2 px-3 text-base md:hover:text-[#2BA78F] md:p-0 md:dark:text-blue-500"
//                   >
//                     Sign Up
//                   </a>
//                 </li>
//                 <li>
//                   <Link to="./login">
//                     <button
//                       type="button"
//                       className="text-sm bg-transparent border-solid border-2 focus:outline-none text-[#2BA78F] border-[#2BA78F] font-bold rounded-full px-4 py-2 hover:bg-[#2BA78F] sm:px-6 sm:py-3 hover:text-white text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 landscape:py-2"
//                     >
//                       LOGIN
//                     </button>
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     data-collapse-toggle="navbar-sticky"
//                     type="button"
//                     className="inline-flex items-center p-2 w-10 h-10 justify-center bg-transparent text-sm text-gray-500 rounded-lg md:hidden hover:bg-[#80cabc] focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//                     aria-controls="navbar-sticky"
//                     aria-expanded={isMenuOpen}
//                     onClick={handleToggleMenu}
//                   >
//                     <span className="sr-only">Open main menu</span>
//                     <svg
//                       className="w-5 h-5"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 17 14"
//                     >
//                       <path
//                         stroke="currentColor"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         stroke-width="2"
//                         d="M1 1h15M1 7h15M1 13h15"
//                       />
//                     </svg>
//                   </button>
//                 </li>
//               </ul>
//             </div>

//             <div
//               className={`items-center justify-between ${
//                 isMenuOpen
//                   ? "absolute top-12 right-4 w-1/2 xs:w-1/3 sm:w-1/3 block"
//                   : "hidden"
//               } md:flex md:w-auto md:order-1`}
//               style={{ zIndex: 1000 }}
//               id="navbar-sticky"
//               ref={menuRef}
//             >
//               {/* <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg bg-[#7cb9ad] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//                     <li>
//                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section1")} aria-current="page">Home</button>
//                     </li>
//                     <li>
//                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section2")}>About</button>
//                     </li>
//                     <li>
//                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section3")}>Services</button>
//                     </li>
//                     <li>
//                         <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#2BA78F] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" onClick={() => scrollToSection("section4")}>Contact</button>
//                     </li>
//                     </ul> */}
//             </div>
//           </div>
//         </nav>

//         <div
//           id="section1"
//           className="absolute top-16 flex flex-col w-full gap-y-5 lg:gap-y-3 justify-center items-center md:top-18 md:mt-6 lg:mt-8"
//         >
//           {/* <span id="section1"></span> */}
//           <h1 className="w-4/5 font-custom text-3xl sm:w-5/6 md:w-3/4 lg:w-2/3 sm:text-4xl md:text-[2.75rem] text-center">
//             <span className="hidden sm:inline">
//               <span className="text-[#2BA78F]">Search for Doctors</span>, book
//               appointments conveniently
//             </span>
//             <span className="sm:hidden">
//               <span className="text-[#2BA78F]">Book</span> Appointments
//               conveniently
//             </span>
//           </h1>
//           <p className="w-1/2 text-center hidden sm:inline ">
//             Lorem ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
//           </p>
//           <button
//             type="button"
//             className={`text-base font-custom bg-[#2BA78F] text-white rounded-full px-4 py-2 hover:bg-[#228672] hover:${custom_shadow} hover:shadow-[#228672] sm:px-6 sm:py-3 hover:text-white text-center`}
//             onClick={() => scrollToSection("section5")}
//             style={{
//               boxShadow: isHovered
//                 ? "1px 1px 100px rgba(36, 139, 119, 0.5)"
//                 : "1px 1px 0 rgba(36, 139, 119, 0)",
//               // transition: 'box-shadow 0.5s ease-in-out',
//             }}
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//           >
//             EXPLORE
//           </button>

//           <div className="flex flex-col lg:flex-row justify-center items-center w-screen min-h-[50vh] lg:gap-x-5 gap-y-5">
//             {/* <div className="bg-[#d4d4d3] w-[55vh] h-[50vh] lg:w-[30vh]"></div> */}
//             <AdBanner targetPage= "patient"/>
//             <div className="w-[50vh] lg:w-7/12 h-full lg:h-[45vh] flex flex-col lg:flex-row items-center justify-center mt-[1.5vh]">
//               <div className="w-[45vh] aspect-[1/1] lg:w-[45vh] lg:h-[47vh] rounded-[2rem] bg-[#AADCD2] flex items-center justify-center">
//                 <img
//                   className="aspect-[1/1] w-11/12 lg:h-11/12 rounded-[2rem]"
//                   src={`${image}`}
//                   alt = {"image"}
//                 />
//               </div>
//               <div className="w-5/6 lg:flex-1 h-[55vh] lg:h-5/6 rectangle rounded-b-[2rem] lg:rounded-none lg:rounded-r-[2rem] bg-[#AADCD2]"></div>
//             </div>
//             <div className="bg-[#d4d4d3] w-[55vh] h-[50vh] lg:w-[30vh]"></div>
//           </div>
//         </div>
//       </div>

//       {/* <div id="section5" className="flex flex-col items-center justify-center mt-12">
//                 <h1 className="w-4/5 font-custom text-3xl sm:w-5/6 md:w-3/4 lg:w-2/3 sm:text-4xl md:text-[2.75rem] text-center">qwertyuiop sdfghjk</h1>
//                 <div className="w-full"></div>
//             </div> */}
//       <div id="section2"></div>
//       <div id="section3"></div>
//       <div id="section4"></div>
//     </div>
//   );
// }
