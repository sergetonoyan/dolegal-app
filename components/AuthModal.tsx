import React, { useState, useEffect } from 'react';
import { AuthModalType } from '../App';
import { useLocalization } from '../context/LocalizationContext';
import LegalModal from './LegalModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: AuthModalType;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialType }) => {
  const [type, setType] = useState(initialType);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const { t } = useLocalization();

  useEffect(() => {
    setType(initialType);
    if (initialType === 'signup') {
        setTermsAccepted(false);
    }
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleSwitch = (newType: AuthModalType) => {
    setType(newType);
  };
  
  const renderTitle = () => {
    switch (type) {
      case 'login': return t('auth_login_title');
      case 'signup': return t('auth_signup_title');
      case 'forgotPassword': return t('auth_forgot_title');
    }
  };

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{renderTitle()}</h2>
                
                {type === 'login' && (
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">{t('auth_email')}</label>
                            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="email" autoComplete="email" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">{t('auth_password')}</label>
                            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" id="password" autoComplete="current-password" />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold transition-colors">{t('auth_login_cta')}</button>
                        <div className="text-sm text-center mt-4">
                            <button type="button" onClick={() => handleSwitch('forgotPassword')} className="text-blue-600 hover:underline">{t('auth_forgot_link')}</button>
                        </div>
                    </form>
                )}

                {type === 'signup' && (
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">{t('auth_name')}</label>
                            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="name" autoComplete="name" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signup-email">{t('auth_email')}</label>
                            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="signup-email" autoComplete="email" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signup-password">{t('auth_password')}</label>
                            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" id="signup-password" autoComplete="new-password" />
                        </div>
                         <div className="mb-6">
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    {t('auth_accept_terms_prefix')}
                                    <button type="button" onClick={() => setTermsOpen(true)} className="font-semibold text-blue-600 hover:underline">{t('auth_terms_link')}</button>
                                    {t('auth_and')}
                                    <button type="button" onClick={() => setPrivacyOpen(true)} className="font-semibold text-blue-600 hover:underline">{t('auth_privacy_link')}</button>
                                    {t('auth_accept_terms_suffix')}
                                </span>
                            </label>
                        </div>
                        <button 
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={!termsAccepted}
                        >
                          {t('auth_signup_cta')}
                        </button>
                    </form>
                )}

                {type === 'forgotPassword' && (
                     <form>
                        <p className="text-center text-gray-600 mb-6">{t('auth_forgot_desc')}</p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="forgot-email">{t('auth_email')}</label>
                            <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="forgot-email" autoComplete="email"/>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold transition-colors">{t('auth_forgot_cta')}</button>
                    </form>
                )}

                <div className="text-center mt-6 text-sm">
                    {type === 'login' && (
                        <p>{t('auth_login_switch_pretext')} <button onClick={() => handleSwitch('signup')} className="font-semibold text-blue-600 hover:underline">{t('auth_login_switch_link')}</button></p>
                    )}
                     {type === 'signup' && (
                        <p>{t('auth_signup_switch_pretext')} <button onClick={() => handleSwitch('login')} className="font-semibold text-blue-600 hover:underline">{t('auth_signup_switch_link')}</button></p>
                    )}
                     {type === 'forgotPassword' && (
                        <p><button onClick={() => handleSwitch('login')} className="font-semibold text-blue-600 hover:underline">{t('auth_forgot_back_link')}</button></p>
                    )}
                </div>
            </div>
          </div>
        </div>

        <LegalModal 
            isOpen={isTermsOpen}
            onClose={() => setTermsOpen(false)}
            title={t('terms_title')}
            content={t('terms_content')}
        />
        <LegalModal 
            isOpen={isPrivacyOpen}
            onClose={() => setPrivacyOpen(false)}
            title={t('privacy_title')}
            content={t('privacy_content')}
        />
    </>
  );
};

export default AuthModal;