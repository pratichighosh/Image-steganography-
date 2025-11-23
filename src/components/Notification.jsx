import { useEffect } from 'react';
import { XCircle, CheckCircle, AlertCircle, X } from 'lucide-react';

export function Notification({ type, message, onClose }) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const configs = {
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-900',
      accentColor: 'bg-green-500'
    },
    error: {
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-900',
      accentColor: 'bg-red-500'
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-900',
      accentColor: 'bg-yellow-500'
    }
  };

  const config = configs[type] || configs.success;

  return (
    <div 
      className="fixed top-4 right-4 z-50 animate-slide-in-right"
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div 
        className={`
          max-w-md w-full ${config.bgColor} 
          shadow-2xl rounded-2xl border-2 ${config.borderColor} 
          p-4 backdrop-blur-sm
          transform transition-all duration-300 hover:scale-105
        `}
      >
        {/* Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${config.accentColor} rounded-t-xl`}></div>
        
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {config.icon}
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${config.textColor} leading-relaxed`}>
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}