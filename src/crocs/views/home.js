import React,{useEffect} from 'react'

import { Helmet } from 'react-helmet'

import Navbar from '../components/navbar'
import HeroPage from '../components/hero'
import Features1 from '../components/features1'
import CTA from '../components/cta'
import Features2 from '../components/features2'
import Pricing from '../components/pricing'
import Steps from '../components/steps'
import Testimonial from '../components/testimonial'
import Contact from '../components/contact'
import Footer from '../components/footer'
import './home.css'
import {  useNavigate } from "react-router-dom";

const Home = (props) => {
  const navigate = useNavigate();
    useEffect(()=>{
    if(localStorage.getItem("Token")){
      navigate(`/${localStorage.getItem("ROLE").toLowerCase()}/home`)
      
    }
  })

  return (
    <div className="home-container">
      <Helmet>
        <title>Healthify</title>
      </Helmet>
      
      <Navbar></Navbar>
      {/* <Hero></Hero> */}
      <HeroPage/>
      <Features1></Features1>
      <CTA></CTA>
      <Features2></Features2>
      {/* <Pricing></Pricing> */}
      <Steps></Steps>
      <Testimonial></Testimonial>
      <Contact></Contact>
      <Footer></Footer>
    </div>
  )
}

export default Home
