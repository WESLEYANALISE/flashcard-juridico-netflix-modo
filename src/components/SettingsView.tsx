
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Volume2, 
  Eye, 
  Palette,
  Info,
  User,
  Bell,
  ArrowLeft
} from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
}

const SettingsView = ({ onBack }: SettingsViewProps) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: {
    icon: any;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-3 sm:py-4">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="p-2 rounded-lg bg-netflix-red/20">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-netflix-red" />
        </div>
        <div>
          <h3 className="font-medium text-white text-sm sm:text-base">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-netflix-black px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header com botão de voltar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-netflix-red">Configurações</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Personalize sua experiência de estudos
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Audio/Visual Preferences */}
          <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-netflix-red" />
              Preferências Audiovisuais
            </h2>
            
            <div className="space-y-1 sm:space-y-2">
              <SettingItem
                icon={Volume2}
                title="Áudio habilitado"
                description="Reproduzir sons e efeitos durante o estudo"
              >
                <Switch
                  checked={audioEnabled}
                  onCheckedChange={setAudioEnabled}
                />
              </SettingItem>
              
              <Separator className="bg-white/10" />
              
              <SettingItem
                icon={Eye}
                title="Animações"
                description="Exibir animações e transições"
              >
                <Switch
                  checked={animationsEnabled}
                  onCheckedChange={setAnimationsEnabled}
                />
              </SettingItem>
              
              <Separator className="bg-white/10" />
              
              <SettingItem
                icon={Palette}
                title="Modo escuro"
                description="Interface com tema escuro"
              >
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </SettingItem>
            </div>
          </Card>

          {/* Study Preferences */}
          <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-netflix-red" />
              Preferências de Estudo
            </h2>
            
            <div className="space-y-1 sm:space-y-2">
              <SettingItem
                icon={Bell}
                title="Avanço automático"
                description="Avançar automaticamente após responder"
              >
                <Switch
                  checked={autoAdvance}
                  onCheckedChange={setAutoAdvance}
                />
              </SettingItem>
            </div>
          </Card>

          {/* App Information */}
          <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-netflix-red" />
              Informações do Aplicativo
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-300">Versão</span>
                <span className="text-sm sm:text-base text-white">1.0.0</span>
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-300">Última atualização</span>
                <span className="text-sm sm:text-base text-white">Dezembro 2024</span>
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-300">Total de flashcards</span>
                <span className="text-sm sm:text-base text-white">6.860</span>
              </div>
            </div>
          </Card>

          {/* Reset Settings */}
          <Card className="bg-netflix-dark/50 border-white/10 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
              Redefinir Configurações
            </h2>
            
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
              Restaurar todas as configurações para os valores padrão.
            </p>
            
            <Button 
              variant="outline" 
              className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
            >
              Redefinir Tudo
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
