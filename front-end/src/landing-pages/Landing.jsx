import React from "react";
import ThemeToggle from "./ThemeToggle";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from "../assets/react.svg";
import heroImage from "../assets/images/hero.png";


const Landing = () => {
  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
      className=" min-h-screen overflow-x-hidden transition-all duration-500"
    >
      {/* NAVBAR */}
      <nav
        className="py-4 shadow-lg transition-all duration-500"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">

          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="School Logo"
              className="h-12 w-12 object-contain hover:scale-110 transition-all duration-300"
            />
            <h1 className="text-2xl font-bold hover:opacity-70 transition-all duration-300">
              Green Valley High School
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <a
              href="/login"
              className="px-6 py-2 rounded font-semibold transition-all duration-300
                         shadow-md hover:shadow-xl hover:scale-105"
              style={{
                background: "var(--text)",
                color: "var(--bg)",
              }}
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-20" style={{ background: "var(--card)" }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">

          <div className="md:w-1/2 mb-8 md:mb-0 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Green Valley School <br /> Management System
            </h1>
            <p className="text-xl mb-8 opacity-90">
              A modern digital platform for managing academic and administrative activities.
            </p>

            <a
              href="/login"
              className="px-8 py-4 rounded-lg font-semibold shadow-xl transition-all duration-300
                         hover:scale-110 hover:shadow-2xl hover:-translate-y-1"
              style={{ background: "var(--text)", color: "var(--bg)" }}
            >
              Get Started
            </a>
          </div>

          <div className="md:w-1/2">
            <img
              src={heroImage}
              alt="School Management"
              className="w-full rounded-xl shadow-2xl transition-all duration-700 
                         hover:scale-105 hover:rotate-1"
            />
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">System Features</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Student Management", desc: "Manage students, grades, attendance, ID cards & more." },
              { title: "Teacher Portal", desc: "Teachers manage classes, assignments and attendance." },
              { title: "Parent Dashboard", desc: "Parents can monitor grades, attendance & daily activities." },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl shadow-lg transition-all duration-500
                           hover:-translate-y-3 hover:shadow-2xl hover:border-b-4 
                           border-blue-600 cursor-pointer"
                style={{
                  background: "var(--card)",
                }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">{feature.title}</h3>
                <p className="opacity-80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Who Can Use This System?</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {["Administrators", "Teachers", "Students", "Parents"].map((role, index) => (
              <div
                key={index}
                className="p-8 rounded-xl text-xl font-medium transition-all duration-500 
                           hover:scale-110 hover:shadow-xl cursor-pointer"
                style={{
                  background: "var(--card)",
                  border: "2px solid var(--border)",
                }}
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20" style={{ background: "var(--card)" }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">About the System</h2>
          <p className="max-w-4xl mx-auto text-lg opacity-90">
            This School Management System reduces paperwork, improves communication,
            and provides real-time access to academic information for everyone.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--card)" }} className="py-10 border-t border-gray-700/10">
        <div className="container mx-auto px-6 text-center">

          <div className="flex justify-center space-x-8 mb-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                className="transition-all duration-300 hover:scale-150 hover:opacity-70 cursor-pointer"
              >
                <Icon size={28} />
              </a>
            ))}
          </div>

          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} Green Valley High School Management System.
          </p>

        </div>
      </footer>
    </div>
  );
};

export default Landing;
