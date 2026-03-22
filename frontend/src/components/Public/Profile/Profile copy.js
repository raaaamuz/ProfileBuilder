import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import CareerTimeline from "../CareerTimeline";
import Education from "./Education";

const profileData = {
  name: "Nagarajan",
  bio: (
    <>
      I am Nagarajan, a Market Research professional with more than a decade of experience in the industry.
      I love reading and talking about customer experience. I create content related to it on
      <a 
        href="https://www.youtube.com/channel/UCEvcyYAo4oeI24gRpDYr0Hw"
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-400 hover:text-red-300 transition-all duration-300 font-semibold"
      >
        {" "}YouTube
      </a> 
      & in my 
      <a 
        href="https://www.linkedin.com/in/itsnagarajan/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 transition-all duration-300 font-semibold"
      >
        {" "}LinkedIn profile
      </a>. 
      My aim is to simplify market research for every marketing professional.
      If you’d like to contact me, you can reach out through my 
      <a 
        href="/contact"
        className="text-green-400 hover:text-green-300 transition-all duration-300 font-semibold"
      >
        {" "}contact form
      </a>.
    </>
  ),
  image: `${process.env.PUBLIC_URL}/profile.jpg`,
  contact: "/contact",
  cv: `${process.env.PUBLIC_URL}/Naga_resume.pdf`,
  phone: "+91 9790094922",
  email: "nagaking@outlook.com",
  social: {
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/in/itsnagarajan/"
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 pt-24 space-y-12">
      {/* Bio Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Card className="p-8 bg-gray-900 bg-opacity-80 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-10">
            
            {/* Profile Image */}
            <motion.img 
              src={profileData.image} 
              alt="Profile" 
              className="w-52 h-52 rounded-full shadow-lg border-4 border-white transition-transform duration-300 hover:rotate-3 hover:scale-105 hover:border-red-500"
              whileHover={{ scale: 1.05 }}
            />
            
            {/* Bio Content */}
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-extrabold text-red-400">{profileData.name}</h1>
              <p className="text-black-300 mt-4 leading-relaxed">{profileData.bio}</p>

              {/* Contact & CV Download Buttons */}
              <div className="mt-8 flex space-x-4 justify-center md:justify-start">
                <motion.a 
                  href={profileData.contact}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.1 }}
                >
                  <FontAwesomeIcon icon={faEnvelope} size="lg" /> Contact Me
                </motion.a>
                
                <motion.a 
                  href={profileData.cv}
                  download="Naga_resume.pdf"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.1 }}
                >
                  Download CV
                </motion.a>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Career and Education Sections */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <CareerTimeline />
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <Education />
      </motion.div>

      {/* Get in Touch Section */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mt-16">
        <div className="text-center border-t border-gray-300 pt-10">
          <h2 className="text-4xl font-bold text-red-400">Get in Touch</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-6 text-gray-800 text-lg">
            
            {/* Phone */}
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faPhone} size="2x" />
              <a href={`tel:${profileData.phone}`} className="mt-2 hover:text-gray-600">
                {profileData.phone}
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
              <a href={`mailto:${profileData.email}`} className="mt-2 hover:text-gray-600">
                {profileData.email}
              </a>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faThumbsUp} size="2x" />
              <div className="flex space-x-4 mt-2">
                <a href={profileData.social.facebook} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} size="lg" className="hover:text-gray-600" />
                </a>
                <a href={profileData.social.twitter} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} size="lg" className="hover:text-gray-600" />
                </a>
                <a href={profileData.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLinkedin} size="lg" className="hover:text-gray-600" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
