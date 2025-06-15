
import { motion, PanInfo } from 'framer-motion';
import { ReactNode } from 'react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  disabled?: boolean;
}

const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className = '',
  disabled = false 
}: SwipeableCardProps) => {
  const swipeThreshold = 100;

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (disabled) return;

    const { offset, velocity } = info;
    
    if (offset.x > swipeThreshold || velocity.x > 500) {
      onSwipeRight?.();
    } else if (offset.x < -swipeThreshold || velocity.x < -500) {
      onSwipeLeft?.();
    }
  };

  return (
    <motion.div
      className={`touch-pan-y select-none ${className}`}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 0.95,
        rotate: 0,
        transition: { duration: 0.1 }
      }}
      animate={{
        scale: 1,
        rotate: 0,
        x: 0
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      style={{
        cursor: disabled ? 'default' : 'grab'
      }}
    >
      {children}
      
      {/* Swipe Indicators */}
      {!disabled && (
        <>
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 opacity-0 pointer-events-none"
            animate={{
              opacity: 0,
              x: -10
            }}
            whileInView={{
              opacity: [0, 0.5, 0],
              x: [-10, 0, 10]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-sm font-medium">→ Correto</span>
          </motion.div>
          
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 opacity-0 pointer-events-none"
            animate={{
              opacity: 0,
              x: 10
            }}
            whileInView={{
              opacity: [0, 0.5, 0],
              x: [10, 0, -10]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <span className="text-sm font-medium">← Incorreto</span>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default SwipeableCard;
