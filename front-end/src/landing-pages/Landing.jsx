import React from "react";
import ThemeToggle from "./ThemeToggle";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGraduationCap, FaChalkboardTeacher, FaUsers, FaUserCheck, FaArrowRight } from "react-icons/fa";
import { MdDashboard, MdSchool } from "react-icons/md";
import logo from "../assets/react.svg";
import heroImage from "../assets/images/office-buildings-trees.jpg";

const Landing = () => {
  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
      className="min-h-screen overflow-x-hidden transition-all duration-500"
    >
      {/* NAVBAR - Glass morphism effect */}
      <nav
        className="py-4 fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-500"
        style={{ 
          background: "var(--card)", 
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">

          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <img
                src={logo}
                alt="School Logo"
                className="h-12 w-12 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-all duration-300">
              Green Valley High School
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <a
              href="/login"
              className="px-6 py-2.5 rounded-full font-semibold transition-all duration-300
                         shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, var(--text) 0%, var(--text) 100%)",
                color: "var(--bg)",
              }}
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Modern gradient + animated elements */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-fadeIn">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              🎓 Since 1995
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Green Valley School <br />
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              A modern digital platform for managing academic and administrative activities with ease and efficiency.
            </p>

            <div className="flex gap-4">
              <a
                href="/login"
                className="px-8 py-4 rounded-full font-semibold shadow-xl transition-all duration-300
                           hover:scale-110 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </a>
              
              <a
                href="#features"
                className="px-8 py-4 rounded-full font-semibold transition-all duration-300
                           hover:scale-105 border-2"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <img
                src={heroImage}
                alt="School Management"
                className="w-full rounded-xl shadow-2xl transition-all duration-700 
                           group-hover:scale-105 group-hover:-rotate-1 relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - With icons and hover cards */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              System Features
            </h2>
            <p className="text-xl opacity-75">Everything you need to manage your school efficiently</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Student Management", desc: "Manage students, grades, attendance, ID cards & more.", icon: FaGraduationCap, color: "from-blue-500 to-cyan-500" },
              { title: "Teacher Portal", desc: "Teachers manage classes, assignments and attendance.", icon: FaChalkboardTeacher, color: "from-purple-500 to-pink-500" },
              { title: "Parent Dashboard", desc: "Parents can monitor grades, attendance & daily activities.", icon: FaUsers, color: "from-green-500 to-emerald-500" },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl shadow-xl transition-all duration-500
                           hover:-translate-y-4 hover:shadow-2xl cursor-pointer relative overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-3xl" />
                </div>
                
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="opacity-70 leading-relaxed">{feature.desc}</p>
                
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-blue-500 font-semibold flex items-center gap-2">
                    Learn more <FaArrowRight className="text-sm" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES - Modern card design with counters */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Who Can Use This System?</h2>
          <p className="text-xl opacity-75 mb-12">Tailored portals for every role in the education ecosystem</p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Administrators", icon: MdDashboard, count: "Full Control", gradient: "from-red-500 to-orange-500" },
              { name: "Teachers", icon: FaChalkboardTeacher, count: "Manage Classes", gradient: "from-blue-500 to-cyan-500" },
              { name: "Students", icon: FaGraduationCap, count: "Access Learning", gradient: "from-green-500 to-emerald-500" },
              { name: "Parents", icon: FaUsers, count: "Monitor Progress", gradient: "from-purple-500 to-pink-500" },
            ].map((role, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-500 
                           hover:scale-105 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: "2px solid var(--border)",
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="text-white text-3xl" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{role.name}</h3>
                <p className="text-sm opacity-60 font-semibold">{role.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT - Enhanced with stats */}
      <section className="py-20" style={{ background: "var(--card)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              About the System
            </h2>
            <p className="max-w-3xl mx-auto text-xl opacity-80 leading-relaxed">
              This School Management System reduces paperwork, improves communication,
              and provides real-time access to academic information for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                   style={{ border: "1px solid var(--border)" }}>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-lg opacity-70 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - Modern gradient */}
      <footer style={{ background: "var(--card)" }} className="py-12 border-t border-gray-700/20">
        <div className="container mx-auto px-6 text-center">

          <div className="flex justify-center space-x-6 mb-8">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 
                           hover:scale-125 hover:-translate-y-1 cursor-pointer group"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
              </div>
            ))}
          </div>

          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Green Valley High School Management System.
            <br className="md:hidden" /> Empowering education through technology.
          </p>
          
          <div className="flex justify-center gap-6 mt-4 text-xs opacity-50">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;