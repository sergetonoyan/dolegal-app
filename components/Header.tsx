import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Logo } from './icons/Logo';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLocalization();

    const toggleLanguage = () => {
        setLanguage(language === 'am' ? 'en' : 'am');
    };

    return (
        <button onClick={toggleLanguage} className="text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1">
            {language === 'am' ? 'EN' : 'AM'}
        </button>
    );
};


const Header: React.FC<{ openAuthModal: (type: 'login' | 'signup') => void }> = ({ openAuthModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLocalization();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200' : 'bg-white'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">{t('header_choose_plan')}</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">{t('header_about')}</a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={() => openAuthModal('login')} className="text-gray-600 font-semibold hover:text-blue-600">{t('header_signin')}</button>
            <button onClick={() => openAuthModal('signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors">
              {t('header_signup')}
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg p-4 border border-gray-200">
            <a href="#pricing" className="block py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{t('header_choose_plan')}</a>
            <a href="#about" className="block py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{t('header_about')}</a>
            <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col gap-3">
                 <button onClick={() => { openAuthModal('login'); setIsOpen(false); }} className="w-full text-center py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg">{t('header_signin')}</button>
                <button onClick={() => { openAuthModal('signup'); setIsOpen(false); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                  {t('header_signup')}
                </button>
                <div className="mt-2 flex justify-center">
                    <LanguageSwitcher />
                </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;