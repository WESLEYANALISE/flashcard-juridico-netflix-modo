
import { Settings, User, Palette, Volume2, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const SettingsView = () => {
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAnimations, setShowAnimations] = useState(true);
  const [studyReminders, setStudyReminders] = useState(false);

  const SettingCard = ({ icon: Icon, title, children }: any) => (
    <Card className="bg-netflix-dark/50 border-white/10 p-6 hover-lift glass-effect">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-netflix-red/20">
          <Icon className="w-5 h-5 text-netflix-red" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </Card>
  );

  const SettingItem = ({ label, description, children }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-400 mt-1">{description}</div>
        )}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-netflix-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-netflix-red">Configurações</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Personalize sua experiência de estudos jurídicos
          </p>
        </div>

        <div className="grid gap-6">
          {/* Study Preferences */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <SettingCard icon={User} title="Preferências de Estudo">
              <div className="space-y-4">
                <SettingItem
                  label="Lembretes de Estudo"
                  description="Receba notificações para manter sua rotina de estudos"
                >
                  <Switch
                    checked={studyReminders}
                    onCheckedChange={setStudyReminders}
                  />
                </SettingItem>
                <SettingItem
                  label="Modo Foco"
                  description="Oculta distrações durante as sessões de estudo"
                >
                  <Switch
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                </SettingItem>
              </div>
            </SettingCard>
          </div>

          {/* Audio/Visual Settings */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SettingCard icon={Volume2} title="Áudio e Visual">
              <div className="space-y-4">
                <SettingItem
                  label="Reprodução Automática de Áudio"
                  description="Reproduz automaticamente comentários em áudio quando disponíveis"
                >
                  <Switch
                    checked={autoPlayAudio}
                    onCheckedChange={setAutoPlayAudio}
                  />
                </SettingItem>
                <SettingItem
                  label="Animações"
                  description="Habilita animações suaves na interface"
                >
                  <Switch
                    checked={showAnimations}
                    onCheckedChange={setShowAnimations}
                  />
                </SettingItem>
              </div>
            </SettingCard>
          </div>

          {/* Theme Settings */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <SettingCard icon={Palette} title="Aparência">
              <div className="space-y-4">
                <SettingItem
                  label="Tema Escuro"
                  description="Interface com cores escuras para reduzir o cansaço visual"
                >
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </SettingItem>
                <SettingItem
                  label="Cor de Destaque"
                  description="Personalize a cor principal da interface"
                >
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 bg-netflix-red rounded-full border-2 border-white/20 cursor-pointer" />
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white/20 cursor-pointer opacity-50" />
                    <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white/20 cursor-pointer opacity-50" />
                  </div>
                </SettingItem>
              </div>
            </SettingCard>
          </div>

          {/* App Information */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <SettingCard icon={Info} title="Informações do App">
              <div className="space-y-4">
                <SettingItem
                  label="Versão"
                  description="Versão atual do aplicativo"
                >
                  <span className="text-gray-400">v2.1.0</span>
                </SettingItem>
                <SettingItem
                  label="Base de Dados"
                  description="Última atualização do conteúdo jurídico"
                >
                  <span className="text-gray-400">Janeiro 2024</span>
                </SettingItem>
                <SettingItem
                  label="Política de Privacidade"
                  description="Saiba como seus dados são protegidos"
                >
                  <Button variant="outline" size="sm" className="text-netflix-red border-netflix-red hover:bg-netflix-red hover:text-white">
                    Ver
                  </Button>
                </SettingItem>
              </div>
            </SettingCard>
          </div>

          {/* Reset Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Redefinir Configurações</h3>
                <p className="text-gray-400 mb-4">
                  Restaurar todas as configurações para os valores padrão
                </p>
                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  Redefinir
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
