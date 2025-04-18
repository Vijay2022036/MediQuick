import React from 'react';
import { Link } from 'react-router-dom';
import { FaPrescriptionBottleAlt, FaShoppingCart, FaShieldAlt } from 'react-icons/fa';
import Footer from '../Footer/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white">
      
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center py-32 px-4">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Your Health, Our Priority</h1>
        <p className="text-lg text-gray-300 max-w-xl mb-8">
          Streamlining pharmacy access, one prescription at a time.
        </p>
        <Link
          to="/shop"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300"
        >
          Explore Our Services
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 text-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<FaPrescriptionBottleAlt className="text-5xl text-orange-500 mb-4" />}
              title="Convenient Prescription Uploads"
              description="Easily upload your prescriptions and have them filled by your pharmacy."
            />
            <FeatureCard
              icon={<FaShoppingCart className="text-5xl text-orange-500 mb-4" />}
              title="Wide Selection of Medications"
              description="Access a comprehensive inventory of medicines from your preferred pharmacy."
            />
            <FeatureCard
              icon={<FaShieldAlt className="text-5xl text-orange-500 mb-4" />}
              title="Secure and Reliable Service"
              description="We prioritize your privacy and ensure the secure handling of your health data."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white text-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="space-y-10 max-w-3xl mx-auto">
            <TestimonialCard
              message="This app has made managing my prescriptions so much easier. I highly recommend it!"
              author="- John Doe, Customer"
            />
            <TestimonialCard
              message="As a pharmacy, this platform has helped us streamline our processes and better serve our patients."
              author="- Jane Smith, Pharmacy Owner"
            />
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-300">
    {icon}
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ message, author }) => (
  <div className="bg-gray-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-md">
    <p className="text-gray-700 italic mb-3">"{message}"</p>
    <p className="font-semibold text-orange-600">{author}</p>
  </div>
);

export default Home;
