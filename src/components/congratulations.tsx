import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import Confetti from 'react-confetti';

interface CongratulationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CongratulationsPopup: React.FC<CongratulationsPopupProps> = ({ isOpen, onClose }) => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Update window dimensions for the confetti canvas
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Set initial dimensions
    if (isOpen) {
      updateDimensions();
    }
    
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm transition-opacity">
      
      {/* Confetti overlay spanning the entire viewport */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false} // Set to true if you want it to fall continuously
          numberOfPieces={400}
          gravity={0.15}
        />
      </div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#fafafa] rounded-3xl p-10 md:p-14 text-center shadow-2xl z-50 transform transition-all scale-100 opacity-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-800 hover:bg-gray-200 p-1 rounded-full transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 stroke-3" />
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">
          Congratulations
        </h2>

        {/* Success Icon */}
        <div className="mx-auto w-32 h-32 bg-[#69db83] rounded-full flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(105,219,131,0.3)]">
          <Check className="w-16 h-16 text-white stroke-4" />
        </div>

        {/* Message Text */}
        <p className="text-[#6b7280] text-lg leading-relaxed max-w-lg mx-auto font-medium">
          You have successfully reserved your slot for this AI model of robot. You are now part of our exclusive early access phase.
        </p>

      </div>
    </div>
  );
};

export default CongratulationsPopup;