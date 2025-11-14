import React from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Features from './Features';
import Pricing from './Pricing';
import FAQ from './FAQ';
import Footer from './Footer';

interface LandingPageProps {
  navigateToChat: () => void;
  openAuthModal: (type: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigateToChat, openAuthModal }) => {
  return (
    <div className="bg-white">
      <Header openAuthModal={openAuthModal} />
      <main>
        <Hero navigateToChat={navigateToChat} />
        <Features />
        <About />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;