import React from 'react'

import PropTypes from 'prop-types'

import './steps.css'

const Steps = (props) => {
  return (
    <div className="steps-container thq-section-padding">
      <div className="steps-max-width thq-section-max-width">
        <div className="steps-container1 thq-grid-2">
          <div className="steps-section-header">
            <h2 className="thq-heading-2">
              Discover the Power of Our Products
            </h2>
            <p className="thq-body-large">
            Unlock the potential of our cutting-edge solutions designed to streamline your hospital management processes. From scheduling to patient management, our products empower you to deliver exceptional care with easeare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </p>
            <div className="steps-actions">
              <button className="thq-button-animated thq-button-filled steps-button">
                <span className="thq-body-small">Main action</span>
              </button>
            </div>
          </div>
          <div className="steps-container2">
            <div className="steps-container3 thq-card">
              <h2 className="thq-heading-2">{props.step1Title}</h2>
              <span className="steps-text04 thq-body-small">
                {props.step1Description}
              </span>
              <label className="steps-text05 thq-heading-3">01</label>
            </div>
            <div className="steps-container4 thq-card">
              <h2 className="thq-heading-2">{props.step2Title}</h2>
              <span className="steps-text07 thq-body-small">
                {props.step2Description}
              </span>
              <label className="steps-text08 thq-heading-3">02</label>
            </div>
            <div className="steps-container5 thq-card">
              <h2 className="thq-heading-2">{props.step3Title}</h2>
              <span className="steps-text10 thq-body-small">
                {props.step3Description}
              </span>
              <label className="steps-text11 thq-heading-3">03</label>
            </div>
            <div className="steps-container6 thq-card">
              <h2 className="thq-heading-2">{props.step4Title}</h2>
              <span className="steps-text13 thq-body-small">
                {props.step4Description}
              </span>
              <label className="steps-text14 thq-heading-3">04</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Steps.defaultProps = {
  step1Description:
    'Access detailed information about all doctors including their specialization, contact details, and availability.',
  step3Description:
    'Efficiently schedule, reschedule, or cancel appointments for patients with just a few clicks.',
  step2Title: 'View Patient Details',
  step2Description:
    'Easily navigate through patient records, medical history, and upcoming appointments for efficient management.',
  step1Title: 'View Doctor Details',
  step3Title: 'Manage Appointments',
  step4Description:
    'Keep track of advertisement updates including creating editing and  deleteing and etc.',
  step4Title: 'Track Advertisement',
}

Steps.propTypes = {
  step1Description: PropTypes.string,
  step3Description: PropTypes.string,
  step2Title: PropTypes.string,
  step2Description: PropTypes.string,
  step1Title: PropTypes.string,
  step3Title: PropTypes.string,
  step4Description: PropTypes.string,
  step4Title: PropTypes.string,
}

export default Steps
