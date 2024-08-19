import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './cta.css';

const CTA = (props) => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the button click
  const handleButtonClick = () => {
    navigate('/register'); // Navigate to the patient home route
  };

  return (
    <div className="thq-section-padding">
      <div className="thq-section-max-width">
        <div className="cta-accent2-bg">
          <div className="cta-accent1-bg">
            <div className="cta-container1">
              <div className="cta-content">
                <span className="thq-heading-2">{props.heading1}</span>
                <p className="thq-body-large">{props.content1}</p>
              </div>
              <div className="cta-actions">
                <button
                  type="button"
                  className="thq-button-filled cta-button"
                  onClick={handleButtonClick} // Add the click handler
                >
                  {props.action1}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CTA.defaultProps = {
  heading1: 'Book an Appointment Today',
  content1:
    'Schedule a consultation with our experienced doctors for personalized care.',
  action1: 'Book Now',
};

CTA.propTypes = {
  heading1: PropTypes.string,
  content1: PropTypes.string,
  action1: PropTypes.string,
};

export default CTA;
