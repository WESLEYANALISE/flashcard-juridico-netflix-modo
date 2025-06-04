
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-netflix-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            {/* Centered Menu Icons */}
            <div className="flex items-center space-x-2 bg-netflix-dark/50 rounded-2xl p-2 border border-white/10">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onViewChange(item.id)}
                    className={`relative flex flex-col items-center px-4 py-3 h-16 rounded-xl transition-all duration-300 group active:scale-95 ${
                      isActive
                        ? 'bg-netflix-red text-white shadow-lg shadow-netflix-red/25'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${
                      isActive ? 'animate-pulse' : 'group-hover:scale-110'
                    }`} />
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-netflix-red rounded-full animate-bounce" />
                    )}
                    
                    {/* Click ripple effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 rounded-xl scale-0 group-active:scale-100 transition-transform duration-200 ease-out" />
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
