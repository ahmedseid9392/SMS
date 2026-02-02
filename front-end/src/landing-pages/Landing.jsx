import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from "../assets/react.svg";
import heroImage from "../assets/images/hero.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="School Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold">Green Valley High School</h1>
          </div>
          <a
            href="/login"
            className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition duration-300"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6">
              Green Valley School <br /> Management System
            </h1>
            <p className="text-xl mb-8">
              A modern digital platform for managing academic and administrative activities in primary, secondary, and preparatory schools.
            </p>
            <a
              href="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition transform duration-300 shadow-lg"
            >
              Get Started
            </a>
          </div>

          <div className="md:w-1/2">
            <img
              src={heroImage}
              alt="School Management"
              className="w-full rounded-lg shadow-2xl hover:scale-105 transition transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 animate-fadeIn">
            System Features
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Student Management", desc: "Manage student records, attendance, grades, and academic history efficiently." },
              { title: "Teacher Portal", desc: "Teachers can manage classes, upload materials, take attendance, and record grades." },
              { title: "Parent Monitoring", desc: "Parents can track their children’s attendance and academic performance." },
            ].map((feature, index) => (
              
              <div
            
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 animate-fadeIn  hover:border-b-4  hover:border-blue-600 "
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 animate-fadeIn">
            Who Can Use This System?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {["Administrators", "Teachers", "Students", "Parents"].map((role, index) => (
              <div
                key={index}
                className="bg-blue-50 border-2 border-blue-200 p-8 rounded-xl text-xl font-medium hover:bg-blue-400 hover:text-white hover:scale-110 transition-all duration-400 animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 animate-fadeIn">
            About the System
          </h2>
          <p className="max-w-4xl mx-auto text-lg text-gray-700 animate-fadeIn delay-300">
            This School Management System is designed to reduce paperwork, improve communication, and provide real-time access to academic information for all stakeholders.
          </p>
        </div>
      </section>
 
      {/* Footer */}
      <footer className="bg-blue-600 text-white py-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center space-x-8 mb-6">
            <a href="#" className="hover:text-gray-300 transition duration-300 transform hover:scale-125">
              <FaFacebookF size={28} />
            </a>
            <a href="#" className="hover:text-gray-300 transition duration-300 transform hover:scale-125">
              <FaTwitter size={28} />
            </a>
            <a href="#" className="hover:text-gray-300 transition duration-300 transform hover:scale-125">
              <FaInstagram size={28} />
            </a>
            <a href="#" className="hover:text-gray-300 transition duration-300 transform hover:scale-125">
              <FaLinkedinIn size={28} />
            </a>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Green Valley High School Management System. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Optional: Add this to tailwind.config.js for fadeIn animation */}
      {/* extend: { keyframes: { fadeIn: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } } }, animation: { fadeIn: 'fadeIn 0.8s ease-out forwards' } } */}
    </div>
  );
};

export default Landing;