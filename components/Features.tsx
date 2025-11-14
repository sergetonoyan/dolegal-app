import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { ChatIcon } from './icons/ChatIcon';
import { CitationIcon } from './icons/CitationIcon';
import { DocumentSuggestionIcon } from './icons/DocumentSuggestionIcon';
import { DocumentDraftingIcon } from './icons/DocumentDraftingIcon';
import { UploadIcon } from './icons/UploadIcon';
import { PinIcon } from './icons/PinIcon';


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const Features: React.FC = () => {
    const { t } = useLocalization();
    const features = [
      {
        icon: <ChatIcon />,
        title: t('feature1_title'),
        description: t('feature1_desc'),
      },
      {
        icon: <CitationIcon />,
        title: t('feature2_title'),
        description: t('feature2_desc'),
      },
      {
        icon: <DocumentSuggestionIcon />,
        title: t('feature3_title'),
        description: t('feature3_desc'),
      },
      {
        icon: <DocumentDraftingIcon />,
        title: t('feature4_title'),
        description: t('feature4_desc'),
      },
      {
        icon: <UploadIcon />,
        title: t('feature5_title'),
        description: t('feature5_desc'),
      },
      {
        icon: <PinIcon filled={true} />, // Example of using filled pin icon
        title: t('feature6_title'),
        description: t('feature6_desc'),
      },
    ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t('features_title')}</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            {t('features_subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;