
import { useState } from 'react';
import { Scale, BarChart3, BookOpen, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Navbar = ({ activeView, onViewChange }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'study', label: 'Estudar', icon: BookOpen },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-netflix-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 netflix-gradient rounded-lg animate-glow">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FlashCards</h1>
                <p className="text-xs text-gray-400">Jurídicos</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onViewChange(item.id)}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeView === item.id
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {activeView === item.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 netflix-gradient rounded-full" />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-netflix-dark/95 backdrop-blur-md border-t border-white/10 animate-slide-up">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeView === item.id
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
