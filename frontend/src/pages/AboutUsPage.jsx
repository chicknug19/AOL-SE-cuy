import React from 'react';
import headerBg from '../assets/header_bg.png';
import divider1 from '../assets/divider_1.png';
import booksSide from '../assets/books_side.png';
import footerDivider from '../assets/footer_divider.png';
import Footer from '../components/Footer'; // Import komponen Footer

const AboutUsPage = () => {
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

      {/* Footer Component Dipanggil Di Sini */}
      <Footer />

    </div>
  );
};

export default AboutUsPage;