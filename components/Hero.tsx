import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

const Hero: React.FC<{ navigateToChat: () => void; }> = ({ navigateToChat }) => {
  const { t } = useLocalization();
  
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
            {t('hero_title_part1')}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">
              {t('hero_title_part2')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('hero_subtitle')}
          </p>
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={navigateToChat}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 text-lg"
            >
              {t('hero_cta')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;