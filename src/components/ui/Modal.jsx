/* EXPORTS: Modal */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-[95vw] max-h-[95vh]';
      default:
        return 'max-w-lg';
    }
  };

  const backdropVariants = {
    hidden: { 
      opacity: 0,
      backdropFilter: 'blur(0px)'
    },
    visible: { 
      opacity: 1,
      backdropFilter: 'blur(12px)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0,
      backdropFilter: 'blur(0px)',
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          style={{
            background: 'rgba(0, 0, 0, 0.4)'
          }}
        >
          <motion.div
            className={`
              relative w-full ${getSizeClasses()} 
              bg-white/10 backdrop-blur-xl border border-white/20
              rounded-2xl shadow-2xl shadow-black/25
              p-6 mx-auto overflow-hidden
              ${className}
            `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-2xl" />
            
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="relative flex items-center justify-between mb-6">
                {title && (
                  <motion.h2 
                    className="text-xl font-semibold text-gray-800 dark:text-white"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {title}
                  </motion.h2>
                )}
                
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="
                      relative p-2 rounded-lg
                      bg-white/10 hover:bg-white/20
                      border border-white/20 hover:border-white/30
                      text-gray-700 dark:text-gray-300
                      hover:text-gray-900 dark:hover:text-white
                      transition-all duration-200
                      group
                    "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <X size={18} className="transition-transform group-hover:rotate-90 duration-200" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {children}
            </motion.div>

            {/* Bottom gradient border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Modal };