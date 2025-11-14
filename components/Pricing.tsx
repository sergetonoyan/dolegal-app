import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const PricingCard = ({ plan, price, description, features, popular }: { plan: string; price: string; description: string; features: string[]; popular?: boolean; }) => (
  <div className={`relative border rounded-lg p-8 flex flex-col ${popular ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-white'}`}>
    {popular && (
      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase">Most Popular</span>
      </div>
    )}
    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    <div className="mb-6">
      <span className="text-5xl font-extrabold text-gray-900">{price}</span>
       <span className="text-gray-500"> / {plan !== 'Custom' && plan !== 'Free' ? 'month' : ''}</span>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <CheckIcon />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 rounded-lg font-bold transition-transform duration-300 ease-in-out transform hover:scale-105 ${popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
      Choose Plan
    </button>
  </div>
);

const Pricing: React.FC = () => {
    const { t } = useLocalization();

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t('pricing_title')}</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            {t('pricing_subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard 
            plan={t('price_tier1_name')}
            price="Free"
            description={t('price_tier1_desc')}
            features={[
              t('price_tier1_feat1'),
              t('price_tier1_feat2'),
            ]}
          />
          <PricingCard 
            plan={t('price_tier2_name')}
            price="8,000 AMD"
            description={t('price_tier2_desc')}
            features={[
              t('price_tier2_feat1'),
              t('price_tier2_feat2'),
              t('price_tier2_feat3'),
            ]}
            popular
          />
          <PricingCard 
            plan={t('price_tier3_name')}
            price="12,000 AMD"
            description={t('price_tier3_desc')}
            features={[
                t('price_tier3_feat1'),
                t('price_tier3_feat2'),
                t('price_tier3_feat3'),
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;