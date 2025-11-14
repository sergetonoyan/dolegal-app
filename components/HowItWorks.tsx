import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

const About: React.FC = () => {
    const { t } = useLocalization();

    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t('about_title')}</h2>
                    <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                        {t('about_subtitle')}
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about_card1_title')}</h3>
                        <p className="text-gray-600">{t('about_card1_desc')}</p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about_card2_title')}</h3>
                        <p className="text-gray-600">{t('about_card2_desc')}</p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about_card3_title')}</h3>
                        <p className="text-gray-600">{t('about_card3_desc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;