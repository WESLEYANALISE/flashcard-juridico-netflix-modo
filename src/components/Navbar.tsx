import { BarChart3, BookOpen, List, RefreshCw, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useResetUserProgress } from '@/hooks/useRealUserProgress';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Navbar = ({ activeView, onViewChange }: NavbarProps) => {
  const { toast } = useToast();
  const resetProgress = useResetUserProgress();

  const menuItems = [
    {
      id: 'study',
      label: 'Estudar',
      icon: BookOpen
    },
    {
      id: 'playlist',
      label: 'Playlists',
      icon: List
    },
    {
      id: 'stats',
      label: 'Estatísticas',
      icon: BarChart3
    },
    {
      id: 'review',
      label: 'Revisar',
      icon: RefreshCw
    }
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleResetStats = async () => {
    try {
      await resetProgress.mutateAsync();
      toast({
        title: "Estatísticas resetadas",
        description: "Todos os dados de progresso foram removidos.",
      });
    } catch (error) {
      toast({
        title: "Erro ao resetar estatísticas",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-netflix-black/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="w-full px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-netflix-dark/60 border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-netflix-dark/95 border-white/20 backdrop-blur-xl">
                <DropdownMenuItem onClick={handleResetStats} className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/20">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resetar Estatísticas
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Navigation Menu */}
            <div className="flex items-center gap-1 sm:gap-2 bg-netflix-dark/90 rounded-2xl sm:rounded-3xl p-2 sm:p-3 border border-white/15 shadow-2xl backdrop-blur-md overflow-hidden max-w-full">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onViewChange(item.id)}
                    className={`
                      relative flex flex-col items-center justify-center 
                      px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4
                      min-h-[60px] sm:min-h-[70px] lg:min-h-[80px]
                      w-[60px] sm:w-[75px] lg:w-[90px]
                      rounded-xl sm:rounded-2xl 
                      transition-all duration-300 ease-out 
                      group overflow-hidden
                      ${isActive 
                        ? 'bg-netflix-red text-white shadow-lg shadow-netflix-red/30 scale-105 border border-netflix-red/50' 
                        : 'text-gray-300 hover:text-white hover:bg-netflix-gray/50 hover:scale-105 active:scale-95 border border-transparent hover:border-white/20'
                      }
                    `}
                  >
                    <div className={`
                      relative z-10 flex flex-col items-center justify-center 
                      transition-all duration-300 gap-1
                    `}>
                      <Icon className={`
                        w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6
                        transition-all duration-300 flex-shrink-0
                        ${isActive 
                          ? 'text-white drop-shadow-lg' 
                          : 'text-gray-300 group-hover:text-white group-hover:scale-110'
                        }
                      `} />
                      <span className={`
                        text-[10px] sm:text-xs lg:text-xs 
                        font-medium sm:font-semibold 
                        tracking-wide transition-all duration-300 
                        text-center leading-tight max-w-full
                        ${isActive 
                          ? 'text-white opacity-100 font-bold' 
                          : 'text-gray-400 opacity-80 group-hover:opacity-100 group-hover:text-white'
                        }
                      `}>
                        {item.label}
                      </span>
                    </div>
                    
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-lg" />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Spacer */}
            <div className="w-10"></div>
          </div>
        </div>
      </nav>
      
      <div className="h-[76px] sm:h-[86px] lg:h-[100px]" />
    </>
  );
};

export default Navbar;
