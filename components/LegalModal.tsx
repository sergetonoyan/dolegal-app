import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        <header className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-grow">
          <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
            {content}
          </div>
        </main>
        <footer className="p-4 border-t border-gray-200 flex justify-end flex-shrink-0">
            <button onClick={onClose} className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 font-semibold transition-colors">
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default LegalModal;