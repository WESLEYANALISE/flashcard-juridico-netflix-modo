
import { BarChart3, BookOpen, Settings, List, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Navbar = ({ activeView, onViewChange }: NavbarProps) => {
  const menuItems = [
    { id: 'study', label: 'Estudar', icon: BookOpen },
    { id: 'playlist', label: 'Playlists', icon: List },
    { id: 'missions', label: 'Missões', icon: Trophy },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-netflix-black/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center">
            {/* Modern Bottom Menu Style Navigation */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-netflix-dark/80 to-netflix-gray/50 rounded-3xl p-3 border border-white/15 shadow-2xl backdrop-blur-md">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onViewChange(item.id)}
                    className={`relative flex flex-col items-center justify-center px-6 py-4 min-h-[80px] w-[90px] rounded-2xl transition-all duration-500 ease-out group overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-br from-netflix-red to-netflix-red/80 text-white shadow-lg shadow-netflix-red/30 scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* Background glow effect */}
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-br from-netflix-red/20 to-transparent opacity-100' 
                        : 'bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100'
                    }`} />
                    
                    {/* Icon container */}
                    <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-300 ${
                      isActive ? 'animate-pulse' : 'group-hover:animate-bounce'
                    }`}>
                      <Icon className={`w-6 h-6 mb-2 transition-all duration-300 ${
                        isActive 
                          ? 'text-white drop-shadow-lg' 
                          : 'text-gray-300 group-hover:text-white group-hover:scale-110'
                      }`} />
                      <span className={`text-xs font-semibold tracking-wide transition-all duration-300 ${
                        isActive 
                          ? 'text-white opacity-100 font-bold' 
                          : 'text-gray-400 opacity-80 group-hover:opacity-100 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg" />
                    )}
                    
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <div className={`absolute inset-0 bg-white/30 rounded-2xl scale-0 group-active:scale-110 transition-transform duration-300 ease-out ${
                        isActive ? 'opacity-20' : 'opacity-10'
                      }`} />
                    </div>
                    
                    {/* Shimmer effect for active button */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar with proper height */}
      <div className="h-[100px]" />
    </>
  );
};

export default Navbar;
