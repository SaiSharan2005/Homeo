// import React from 'react'

// import Script from 'dangerous-html/react'
// import PropTypes from 'prop-types'

// import './hero.css'

// const Hero = (props) => {
//   return (
//     <div className="hero-header78">
//       <div className="hero-column thq-section-padding thq-section-max-width">
//         <div className="hero-content">
//           <h1 className="hero-text thq-heading-1">{props.heading1}</h1>
//           <p className="hero-text1 thq-body-large">{props.content1}</p>
//         </div>
//         <div className="hero-actions">
//           <button className="thq-button-filled hero-button">
//             <span className="thq-body-small">{props.action1}</span>
//           </button>
//           <button className="thq-button-outline hero-button1">
//             <span className="thq-body-small">{props.action2}</span>
//           </button>
//         </div>
//       </div>
//       <div className="hero-content1">
//         <div className="hero-row-container thq-animated-group-container-horizontal thq-mask-image-horizontal">
//           <div className="thq-animated-group-horizontal">
//             <img
//               alt={props.image1Alt}
//               src={props.image1Src}
//               className="hero-placeholder-image thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image2Alt}
//               src={props.image2Src}
//               className="hero-placeholder-image01 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image3Alt}
//               src={props.image3Src}
//               className="hero-placeholder-image02 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image4Alt}
//               src={props.image4Src}
//               className="hero-placeholder-image03 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image5Alt}
//               src={props.image5Src}
//               className="hero-placeholder-image04 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image6Alt}
//               src={props.image6Src}
//               className="hero-placeholder-image05 thq-img-scale thq-img-ratio-1-1"
//             />
//           </div>
//           <div className="thq-animated-group-horizontal">
//             <img
//               alt={props.image1Alt}
//               src={props.image1Src}
//               className="hero-placeholder-image06 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image2Alt}
//               src={props.image2Src}
//               className="hero-placeholder-image07 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image3Alt}
//               src={props.image3Src}
//               className="hero-placeholder-image08 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image4Alt}
//               src={props.image4Src}
//               className="hero-placeholder-image09 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image5Alt}
//               src={props.image5Src}
//               className="hero-placeholder-image10 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt="Hero Image"
//               src="https://images.unsplash.com/photo-1534312527009-56c7016453e6?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDIxfHxhYnN0cmFjdHxlbnwwfHx8fDE3MTA4NzA5MzB8MA&amp;ixlib=rb-4.0.3&amp;w=1500"
//               className="hero-placeholder-image11 thq-img-scale thq-img-ratio-1-1"
//             />
//           </div>
//         </div>
//         <div className="hero-row-container1 thq-animated-group-container-horizontal thq-mask-image-horizontal">
//           <div className="thq-animated-group-horizontal-reverse">
//             <img
//               alt={props.image7Alt}
//               src={props.image7Src}
//               className="hero-placeholder-image12 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image8Alt}
//               src={props.image8Src}
//               className="hero-placeholder-image13 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image9Alt}
//               src={props.image9Src}
//               className="hero-placeholder-image14 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image10Alt}
//               src={props.image10Src}
//               className="hero-placeholder-image15 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image11Alt}
//               src={props.image11Src}
//               className="hero-placeholder-image16 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image12Alt}
//               src={props.image12Src}
//               className="hero-placeholder-image17 thq-img-scale thq-img-ratio-1-1"
//             />
//           </div>
//           <div className="thq-animated-group-horizontal-reverse">
//             <img
//               alt={props.image7Alt}
//               src={props.image7Src}
//               className="hero-placeholder-image18 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image8Alt}
//               src={props.image8Src}
//               className="hero-placeholder-image19 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image9Alt}
//               src={props.image9Src}
//               className="hero-placeholder-image20 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image10Alt}
//               src={props.image10Src}
//               className="hero-placeholder-image21 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt={props.image11Alt}
//               src={props.image11Src}
//               className="hero-placeholder-image22 thq-img-scale thq-img-ratio-1-1"
//             />
//             <img
//               alt="Hero Image"
//               src="https://images.unsplash.com/photo-1568214379698-8aeb8c6c6ac8?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEyfHxncmFmaWN8ZW58MHx8fHwxNzE1Nzk0OTk5fDA&amp;ixlib=rb-4.0.3&amp;w=1500"
//               className="hero-placeholder-image23 thq-img-scale thq-img-ratio-1-1"
//             />
//           </div>
//         </div>
//       </div>
//       <div>
//         <div className="hero-container1">
//           <Script
//             html={`<style>
//   @keyframes scroll-x {
//     from {
//       transform: translateX(0);
//     }
//     to {
//       transform: translateX(calc(-100% - 16px));
//     }
//   }

//   @keyframes scroll-y {
//     from {
//       transform: translateY(0);
//     }
//     to {
//       transform: translateY(calc(-100% - 16px));
//     }
//   }
// </style>
// `}
//           ></Script>
//         </div>
//       </div>
//     </div>
//   )
// }

// Hero.defaultProps = {
//   image3Src:
//     'https://images.unsplash.com/photo-1585517342886-1f076085742a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4MHw&ixlib=rb-4.0.3&q=80&w=1080',
//   image8Alt: 'Hero Image',
//   image2Src:
//     'https://images.unsplash.com/photo-1606942040878-9a852c5045a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4MXw&ixlib=rb-4.0.3&q=80&w=1080',
//   image6Alt: 'Hero Image',
//   image11Src:
//     'https://images.unsplash.com/photo-1600291994772-1e7d606e9307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4Mnw&ixlib=rb-4.0.3&q=80&w=1080',
//   image5Alt: 'Hero Image',
//   image1Alt: 'Hospital Management System Image',
//   image7Src:
//     'https://images.unsplash.com/photo-1601488844130-d43ad826b912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4M3w&ixlib=rb-4.0.3&q=80&w=1080',
//   image7Alt: 'Hero Image',
//   image12Alt: 'Hero Image',
//   image2Alt: 'Hero Image',
//   image6Src:
//     'https://images.unsplash.com/photo-1492589824053-2c91d773c463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4M3w&ixlib=rb-4.0.3&q=80&w=1080',
//   image12Src:
//     'https://images.unsplash.com/photo-1558715841-07ae24e7ecac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4M3w&ixlib=rb-4.0.3&q=80&w=1080',
//   image3Alt: 'Hero Image',
//   image9Src:
//     'https://images.unsplash.com/photo-1585517342886-1f076085742a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4NHw&ixlib=rb-4.0.3&q=80&w=1080',
//   image11Alt: 'Hero Image',
//   action2: 'Secondary action',
//   action1: 'Main action',
//   image8Src:
//     'https://images.unsplash.com/photo-1616599373337-3e200361bd4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4NHw&ixlib=rb-4.0.3&q=80&w=1080',
//   image5Src:
//     'https://images.unsplash.com/photo-1552354761-ff3bdf9e4881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4NHw&ixlib=rb-4.0.3&q=80&w=1080',
//   image4Src:
//     'https://images.unsplash.com/photo-1615715931938-fb8351222e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4NXw&ixlib=rb-4.0.3&q=80&w=1080',
//   image10Alt: 'Hero Image',
//   image4Alt: 'Hero Image',
//   heading1: 'Welcome to Hospital Management System',
//   content1:
//     'Manage all your hospital operations efficiently with our comprehensive system. Access doctor details, patient information, and appointment schedules seamlessly.',
//   image10Src:
//     'https://images.unsplash.com/photo-1594337090886-2e403ec222e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4NXw&ixlib=rb-4.0.3&q=80&w=1080',
//   image9Alt: 'Hero Image',
//   image1Src:
//     'https://images.unsplash.com/photo-1617957743125-e0680ab56e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyMjc2NjU4Nnw&ixlib=rb-4.0.3&q=80&w=1080',
// }

// Hero.propTypes = {
//   image3Src: PropTypes.string,
//   image8Alt: PropTypes.string,
//   image2Src: PropTypes.string,
//   image6Alt: PropTypes.string,
//   image11Src: PropTypes.string,
//   image5Alt: PropTypes.string,
//   image1Alt: PropTypes.string,
//   image7Src: PropTypes.string,
//   image7Alt: PropTypes.string,
//   image12Alt: PropTypes.string,
//   image2Alt: PropTypes.string,
//   image6Src: PropTypes.string,
//   image12Src: PropTypes.string,
//   image3Alt: PropTypes.string,
//   image9Src: PropTypes.string,
//   image11Alt: PropTypes.string,
//   action2: PropTypes.string,
//   action1: PropTypes.string,
//   image8Src: PropTypes.string,
//   image5Src: PropTypes.string,
//   image4Src: PropTypes.string,
//   image10Alt: PropTypes.string,
//   image4Alt: PropTypes.string,
//   heading1: PropTypes.string,
//   content1: PropTypes.string,
//   image10Src: PropTypes.string,
//   image9Alt: PropTypes.string,
//   image1Src: PropTypes.string,
// }

// export default Hero





import React from "react";

const HeroPage = () => {
  return (
    <div className="min-h-auto bg-white">
      {/* Hero Section */}
      <header className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Hospital Management System</h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage all your hospital operations efficiently with our comprehensive system.
            Access doctor details, patient information, and appointment schedules seamlessly.
          </p>
          <div className="mt-8">
            <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full mr-4">
              Welcome
            </button>
            {/* <button className="bg-orange-200 hover:bg-orange-300 text-gray-800 font-bold py-2 px-4 rounded-full">
              Secondary action
            </button> */}
          </div>
        </div>
      </header>

      {/* Image Grid */}
      {/* <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://source.unsplash.com/random/300x300?hospital",
              "https://source.unsplash.com/random/301x301?medicine",
              "https://source.unsplash.com/random/302x302?healthcare",
              "https://source.unsplash.com/random/303x303?doctor",
              "https://source.unsplash.com/random/304x304?hospital",
              "https://source.unsplash.com/random/305x305?medicine",
              "https://source.unsplash.com/random/306x306?healthcare",
              "https://source.unsplash.com/random/307x307?doctor"
            ].map((img, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md">
                <img src={img} alt="Grid Image" className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HeroPage;
