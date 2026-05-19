import React from 'react';
import headerBg from './assets/header_bg.png';
import divider1 from './assets/divider_1.png';
import booksSide from './assets/books_side.png';
import footerDivider from './assets/footer_divider.png';

const AboutUs = () => {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-800">
      
      {/* Header Section */}
      <section className="relative w-full h-[300px] md:h-[500px]">
        <img src={headerBg} alt="Header" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <div className="text-center font-serif mt-12 md:mt-0">
            <h1 className="text-5xl md:text-7xl mb-2">About</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 md:w-24 bg-white/70"></div>
              <h2 className="text-4xl md:text-6xl">Us</h2>
              <div className="h-px w-12 md:w-24 bg-white/70"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Our Story */}
      <section className="grid grid-cols-1 md:grid-cols-3 min-h-[300px] md:min-h-[400px]">
        <div className="bg-[#E6E6E6] relative p-8 md:col-span-1 min-h-[150px]">
          <h3 
            className="absolute bottom-8 right-8 text-[#8B8B8B] font-bold text-xl md:text-2xl tracking-[0.3em] uppercase" 
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Our Story
          </h3>
        </div>
        <div className="bg-[#744F44] text-white p-8 md:p-16 flex flex-col justify-center items-end text-right md:col-span-2">
          <p className="font-bold text-lg md:text-xl mb-6 max-w-xl leading-relaxed">
            We started Bookugers with a simple idea<br/>
            to make reading more accessible and<br/>
            convenient for everyone.
          </p>
          <p className="font-bold text-lg md:text-xl max-w-xl leading-relaxed">
            In a fast paced digital world, we believe<br/>
            books should be easy to borrow, share,<br/>
            and enjoy anytime. Our platform connects<br/>
            readers with the books they love without<br/>
            the hassle of traditional borrowing.
          </p>
        </div>
      </section>

      {/* Divider 1 */}
      <div className="w-full h-24 md:h-48">
        <img src={divider1} alt="Divider" className="w-full h-full object-cover" />
      </div>

      {/* Section 2: Bookugers */}
      <section className="grid grid-cols-1 md:grid-cols-3 min-h-[250px] md:min-h-[350px]">
        <div className="bg-[#744F44] text-white relative p-8 md:col-span-1 min-h-[150px]">
          <h3 className="absolute bottom-8 right-8 font-bold text-2xl md:text-3xl">Bookugers</h3>
        </div>
        <div className="md:col-span-2 h-[250px] md:h-auto">
          <img src={booksSide} alt="Books" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Section 3: Our Goal */}
      <section className="grid grid-cols-1 md:grid-cols-3 min-h-[300px] md:min-h-[400px]">
        <div className="bg-[#E6E6E6] relative p-8 md:col-span-1 min-h-[150px]">
          <h3 
            className="absolute bottom-8 right-8 text-[#8B8B8B] font-bold text-xl md:text-2xl tracking-[0.3em] uppercase" 
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Our Goal
          </h3>
        </div>
        <div className="bg-[#744F44] text-white p-8 md:p-16 flex flex-col justify-center items-end text-right md:col-span-2">
          <p className="font-bold text-lg md:text-xl max-w-xl leading-relaxed">
            Our goal is to create a seamless and<br/>
            user friendly book lending experience.<br/>
            We aim to encourage more people to<br/>
            read, explore new stories, and build a<br/>
            community where books can be shared<br/>
            easily and efficiently.
          </p>
        </div>
      </section>

      {/* Footer Divider */}
      <div className="w-full h-32 md:h-56">
        <img src={footerDivider} alt="Footer Divider" className="w-full h-full object-cover" />
      </div>

      {/* Footer */}
      <footer className="bg-[#C1272D] text-white pt-12 pb-6 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-8">
          
          {/* Logo & Name */}
          <div className="flex flex-col items-start">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 p-1">
              <svg className="w-full h-full text-[#38A169]" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="white" stroke="#38A169" strokeWidth="3"/>
                <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
                <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
                <path d="M35 50 L65 50" stroke="#38A169" strokeWidth="3"/>
                <path d="M35 65 L65 65" stroke="#38A169" strokeWidth="3"/>
                <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#38A169"/>
              </svg>
            </div>
            <h4 className="font-bold text-lg mb-1">Bookugers Library Management</h4>
            <p className="text-xs opacity-90 max-w-[200px] leading-relaxed">Your Gateway to Endless Reading Adventures</p>
          </div>

          {/* Contact Us */}
          <div className="md:ml-8">
            <h4 className="font-bold text-sm mb-4 relative inline-block">
              Contact Us
              <div className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white"></div>
            </h4>
            <ul className="space-y-4 text-xs font-medium">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="leading-relaxed">Jl. Jalur Sutera Barat No. 17, Alam Sutera,<br/>Panunggangan, Kec. Pinang, Kota Tangerang, Banten<br/>15143</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+62 812 9999 9999</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>lntbinus@binus.edu</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="md:ml-auto">
            <h4 className="font-bold text-sm mb-4 relative inline-block">
              Follow Us
              <div className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white"></div>
            </h4>
            <div className="flex items-center gap-3 mt-2">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 0012.67-1.48v-5.22a8.21 8.21 0 004.77 1.52v-3.4a4.83 4.83 0 01-2.85-1.03z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="max-w-6xl mx-auto pt-4 text-center">
          <p className="text-[10px] opacity-60">© 2024 Bookugers Team L. All rights reserved and together health prosperus oiu</p>
        </div>
      </footer>

    </div>
  );
};

export default AboutUs;
