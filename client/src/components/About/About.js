import React from 'react';
import { FaHeart, FaUsers, FaShieldAlt, FaHandshake } from 'react-icons/fa'; // Import icons
import Footer from '../Footer/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our mission is to revolutionize healthcare access by connecting patients, pharmacies, and healthcare
            professionals through a secure and user-friendly online platform.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <FaHeart className="text-4xl text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Patient-Centric</h3>
              <p className="text-gray-600">We always prioritize the needs and well-being of our users.</p>
            </div>
            {/* Value 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <FaUsers className="text-4xl text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">We believe in working together to improve healthcare for everyone.</p>
            </div>
            {/* Value 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <FaShieldAlt className="text-4xl text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security</h3>
              <p className="text-gray-600">We protect your data with the utmost care and advanced security measures.</p>
            </div>
            {/* Value 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <FaHandshake className="text-4xl text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                <p className="text-gray-600">We are commited to the highest ethical standards.</p>
              </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <img
                src="https://placehold.co/200x200" // Placeholder image
                alt="Team Member"
                className="rounded-full w-40 h-40 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">John Doe</h3>
              <p className="text-gray-600">CEO</p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <img
                src="https://placehold.co/200x200" // Placeholder image
                alt="Team Member"
                className="rounded-full w-40 h-40 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Jane Smith</h3>
              <p className="text-gray-600">CTO</p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <img
                src="https://placehold.co/200x200" // Placeholder image
                alt="Team Member"
                className="rounded-full w-40 h-40 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Alice Johnson</h3>
              <p className="text-gray-600">Head of Operations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
