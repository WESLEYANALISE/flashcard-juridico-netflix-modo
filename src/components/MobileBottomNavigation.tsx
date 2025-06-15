
import { BookOpen, BarChart3, List, RefreshCw, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileBottomNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const MobileBottomNavigation = ({ activeView, onViewChange }: MobileBottomNavigationProps) => {
  const menuItems = [
    {
      id: 'study',
      label: 'Estudar',
      icon: BookOpen,
      badge: false
    },
    {
      id: 'playlist',
      label: 'Playlists',
      icon: List,
      badge: false
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: BarChart3,
      badge: false
    },
    {
      id: 'review',
      label: 'Revisar',
      icon: RefreshCw,
      badge: true // Exemplo de badge
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      badge: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-netflix-black/95 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative flex flex-col items-center justify-center p-3 min-w-[60px]"
              whileTap={{ scale: 0.95 }}
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
            >
              {/* Background Glow */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-netflix-red/20"
                  layoutId="activeBackground"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}
              
              {/* Icon Container */}
              <div className="relative mb-1">
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive 
                      ? 'text-netflix-red' 
                      : 'text-gray-400'
                  }`} 
                />
                
                {/* Badge */}
                {item.badge && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-netflix-red rounded-full border-2 border-netflix-black"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium transition-colors duration-200 ${
                isActive 
                  ? 'text-netflix-red' 
                  : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 w-1 h-1 bg-netflix-red rounded-full"
                  layoutId="activeIndicator"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
