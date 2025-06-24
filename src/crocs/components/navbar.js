import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = (props) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/patient/signup');
  };

  return (
    <header className="navbar-container">
      <header data-thq="thq-navbar" className="navbar-navbar-interactive">
        <h1><b>Healthcare</b></h1>
        <div data-thq="thq-navbar-nav" className="navbar-desktop-menu">
          <nav className="navbar-links">
            <span className="thq-link thq-body-small">Doctor</span>
          </nav>
          <div className="navbar-buttons">
            <button 
              className="navbar-action1 thq-button-animated thq-button-filled" 
              onClick={handleLoginClick}>
              <span className="thq-body-small">LOGIN</span>
            </button>
            <button 
              className="navbar-action2 thq-button-outline thq-button-animated" 
              onClick={handleSignUpClick}>
              <span className="thq-body-small">Sign Up</span>
            </button>
          </div>
        </div>
        <div data-thq="thq-burger-menu" className="navbar-burger-menu">
          <svg viewBox="0 0 1024 1024" className="navbar-icon">
            <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
          </svg>
        </div>
        <div data-thq="thq-mobile-menu" className="navbar-mobile-menu">
          <div className="navbar-nav">
            <div className="navbar-top">
              <img
                alt={props.logoAlt}
                src={props.logoSrc}
                className="navbar-logo"
              />
              <div data-thq="thq-close-menu" className="navbar-close-menu">
                <svg viewBox="0 0 1024 1024" className="navbar-icon2">
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <nav className="navbar-links1">
              <span className="thq-link thq-body-small">{props.link1}</span>
              <span className="thq-link thq-body-small">{props.link2}</span>
              <span className="thq-link thq-body-small">{props.link3}</span>
              <span className="thq-link thq-body-small">{props.link4}</span>
              <span className="thq-link thq-body-small">{props.link5}</span>
            </nav>
          </div>
          <div className="navbar-buttons1">
            <button className="thq-button-filled" onClick={handleLoginClick}>Login</button>
            <button className="thq-button-outline" onClick={handleSignUpClick}>Register</button>
          </div>
        </div>
      </header>
    </header>
  );
};

Navbar.defaultProps = {
  link1: 'Doctors',
  link5: 'Link5',
  link2: 'Patients',
  logoSrc:
    'https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/84ec08e8-34e9-42c7-9445-d2806d156403/fac575ac-7a41-484f-b7ac-875042de11f8?org_if_sml=1&force_format=original',
  action2: 'Action 2',
  logoAlt: 'logo',
  link3: 'Appointments',
  action1: 'Action 1',
  link4: 'Link4',
};

Navbar.propTypes = {
  link1: PropTypes.string,
  link5: PropTypes.string,
  link2: PropTypes.string,
  logoSrc: PropTypes.string,
  action2: PropTypes.string,
  logoAlt: PropTypes.string,
  link3: PropTypes.string,
  action1: PropTypes.string,
  link4: PropTypes.string,
};

export default Navbar;
