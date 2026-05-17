import React from "react";
import ThemeToggle from "./ThemeToggle";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import heroImage from "../assets/images/office-buildings-trees.jpg";

const Landing = () => {
  return (
    <div
      style={{
        background: "transparent",
        color: "var(--text)",
      }}
      className="min-h-screen overflow-x-hidden transition-all duration-500"
    >
      <nav className="fixed left-0 right-0 top-0 z-50 py-4 transition-all duration-500">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="glass-panel flex items-center justify-between rounded-[1.8rem] px-4 py-3 md:px-6">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary), #0ea5e9)" }}
              >
                <FaGraduationCap size={22} />
              </div>
              <div>
                <h1 className="section-title text-lg font-semibold md:text-2xl">Green Valley High School</h1>
                <p className="text-muted hidden text-xs md:block">A modern academic management platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--primary-strong))",
                  color: "#fff",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <span>Login</span>
                <FaArrowRight className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-40">
        <div
          className="absolute top-20 -left-20 h-96 w-96 rounded-full blur-3xl animate-pulse"
          style={{ background: "rgba(37, 99, 235, 0.16)" }}
        ></div>
        <div
          className="absolute bottom-20 -right-20 h-96 w-96 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ background: "rgba(14, 165, 233, 0.14)" }}
        ></div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 md:flex-row">
          <div className="mb-8 md:mb-0 md:w-1/2 animate-fadeIn">
            <div className="glass-panel mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold">
              Since 1995
            </div>
            <h1 className="section-title mb-6 text-5xl font-bold leading-tight md:text-6xl xl:text-7xl">
              Green Valley School <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-muted mb-8 max-w-2xl text-lg leading-relaxed md:text-xl">
              A polished digital workspace for administrators, teachers, students, and parents to manage school life
              with clarity, speed, and confidence.
            </p>

            <div className="flex gap-4">
              <a
                href="/login"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, var(--primary), #0ea5e9)", color: "white", boxShadow: "var(--shadow-md)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              <a
                href="#features"
                className="glass-panel rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ color: "var(--text)" }}
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="group relative">
              <div className="glass-panel absolute -inset-5 rounded-[2rem] opacity-70"></div>
              <img
                src={heroImage}
                alt="School Management"
                className="relative z-10 w-full rounded-[1.8rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="section-title mb-4 text-4xl font-bold md:text-5xl">System Features</h2>
            <p className="text-muted text-lg md:text-xl">Everything you need to manage your school efficiently</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Student Management",
                desc: "Manage students, grades, attendance, ID cards, and performance records from one workspace.",
                icon: FaGraduationCap,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Teacher Portal",
                desc: "Let teachers manage classes, assignments, results, and classroom routines with less friction.",
                icon: FaChalkboardTeacher,
                color: "from-sky-500 to-blue-600",
              },
              {
                title: "Parent Dashboard",
                desc: "Give parents clear visibility into attendance, progress, and school communication.",
                icon: FaUsers,
                color: "from-emerald-500 to-teal-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="surface-card group relative cursor-pointer overflow-hidden rounded-[1.8rem] p-8 transition-all duration-500 hover:-translate-y-3"
              >
                <div
                  className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-20`}
                ></div>

                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="text-3xl text-white" />
                </div>

                <h3 className="mb-4 text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.desc}</p>

                <div className="mt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-2 font-semibold" style={{ color: "var(--primary)" }}>
                    Learn more <FaArrowRight className="text-sm" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, rgba(37,99,235,0.05), transparent)" }}></div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="section-title mb-6 text-4xl font-bold md:text-5xl">Who Can Use This System?</h2>
          <p className="text-muted mb-12 text-lg md:text-xl">Tailored portals for every role in the education ecosystem</p>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { name: "Administrators", icon: MdDashboard, count: "Full Control", gradient: "from-red-500 to-orange-500" },
              { name: "Teachers", icon: FaChalkboardTeacher, count: "Manage Classes", gradient: "from-blue-500 to-cyan-500" },
              { name: "Students", icon: FaGraduationCap, count: "Access Learning", gradient: "from-green-500 to-emerald-500" },
              { name: "Parents", icon: FaUsers, count: "Monitor Progress", gradient: "from-slate-500 to-sky-500" },
            ].map((role, index) => (
              <div
                key={index}
                className="surface-card group relative cursor-pointer overflow-hidden rounded-[1.8rem] p-8 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}></div>

                <div
                  className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${role.gradient} transition-transform duration-300 group-hover:scale-110`}
                >
                  <role.icon className="text-3xl text-white" />
                </div>

                <h3 className="mb-2 text-2xl font-bold">{role.name}</h3>
                <p className="text-sm font-semibold text-muted">{role.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass-panel rounded-[2rem] px-6 py-14 md:px-10">
            <div className="mb-12 text-center">
              <h2 className="section-title mb-6 text-4xl font-bold md:text-5xl">About the System</h2>
              <p className="text-muted mx-auto max-w-3xl text-lg leading-relaxed md:text-xl">
                This School Management System reduces paperwork, improves communication, and provides real-time
                access to academic information for everyone.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "99.9%", label: "Uptime" },
                { number: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-[1.5rem] p-6 text-center transition-all duration-300 hover:-translate-y-1"
                  style={{ border: "1px solid var(--border)", background: "var(--bg-soft)" }}
                >
                  <div className="text-4xl font-bold" style={{ color: "var(--primary)" }}>
                    {stat.number}
                  </div>
                  <div className="mt-2 text-lg text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="glass-panel rounded-[1.8rem] px-6 py-10">
            <div className="mb-8 flex justify-center space-x-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <div
                  key={i}
                  className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:scale-125"
                  style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
                >
                  <Icon size={20} className="transition-transform group-hover:scale-110" />
                </div>
              ))}
            </div>

            <p className="text-muted text-sm">
              © {new Date().getFullYear()} Green Valley High School Management System.
              <br className="md:hidden" /> Empowering education through technology.
            </p>

            <div className="mt-4 flex justify-center gap-6 text-xs text-muted">
              <a href="#" className="transition-opacity hover:opacity-100">
                Privacy Policy
              </a>
              <a href="#" className="transition-opacity hover:opacity-100">
                Terms of Service
              </a>
              <a href="#" className="transition-opacity hover:opacity-100">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
