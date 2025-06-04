
import { useState } from 'react';
import { Settings, User, Palette, Bell, Shield, HelpCircle, Download, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    showAnswerByDefault: true,
    enableNotifications: false,
    studyReminders: true,
    soundEffects: false,
    autoAdvance: false,
    studyGoalPerDay: 10,
    difficulty: 'medium'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const SettingCard = ({ icon: Icon, title, description, children }: any) => (
    <Card className="bg-netflix-dark/50 border-white/10 p-6 glass-effect hover-lift">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-netflix-red/20 rounded-lg">
          <Icon className="w-6 h-6 text-netflix-red" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </Card>
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
            Personalize sua experiência de estudo jurídico
          </p>
        </div>

        <div className="space-y-6">
          {/* Study Preferences */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <SettingCard
              icon={User}
              title="Preferências de Estudo"
              description="Configure como você prefere estudar"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Mostrar resposta por padrão</label>
                    <p className="text-sm text-gray-400">Exibe a resposta automaticamente ao abrir o card</p>
                  </div>
                  <Switch
                    checked={settings.showAnswerByDefault}
                    onCheckedChange={(checked) => handleSettingChange('showAnswerByDefault', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Avanço automático</label>
                    <p className="text-sm text-gray-400">Avança automaticamente após responder</p>
                  </div>
                  <Switch
                    checked={settings.autoAdvance}
                    onCheckedChange={(checked) => handleSettingChange('autoAdvance', checked)}
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">
                    Meta diária: {settings.studyGoalPerDay} cards
                  </label>
                  <Slider
                    value={[settings.studyGoalPerDay]}
                    onValueChange={(value) => handleSettingChange('studyGoalPerDay', value[0])}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </SettingCard>
          </div>

          {/* Notifications */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SettingCard
              icon={Bell}
              title="Notificações"
              description="Configure lembretes e alertas"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Habilitar notificações</label>
                    <p className="text-sm text-gray-400">Receba notificações sobre seu progresso</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Lembretes de estudo</label>
                    <p className="text-sm text-gray-400">Receba lembretes para estudar diariamente</p>
                  </div>
                  <Switch
                    checked={settings.studyReminders}
                    onCheckedChange={(checked) => handleSettingChange('studyReminders', checked)}
                    disabled={!settings.enableNotifications}
                  />
                </div>
              </div>
            </SettingCard>
          </div>

          {/* Audio & Visual */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <SettingCard
              icon={Palette}
              title="Áudio e Visual"
              description="Personalize a interface e sons"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Efeitos sonoros</label>
                    <p className="text-sm text-gray-400">Sons ao acertar/errar respostas</p>
                  </div>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                  />
                </div>
              </div>
            </SettingCard>
          </div>

          {/* Data Management */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <SettingCard
              icon={Shield}
              title="Gerenciar Dados"
              description="Backup e restauração do progresso"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Progresso
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Progresso
                </Button>
              </div>
            </SettingCard>
          </div>

          {/* Help & Support */}
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <SettingCard
              icon={HelpCircle}
              title="Ajuda e Suporte"
              description="Precisa de ajuda? Encontre recursos úteis"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Central de Ajuda
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-netflix-red/20 border-netflix-red/50 text-netflix-red hover:bg-netflix-red/30"
                >
                  Feedback
                </Button>
              </div>
            </SettingCard>
          </div>

          {/* App Info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card className="bg-netflix-dark/50 border-white/10 p-6 text-center glass-effect">
              <h3 className="text-lg font-semibold text-white mb-2">FlashCards Jurídicos</h3>
              <p className="text-gray-400 text-sm mb-4">
                Versão 1.0.0 • Desenvolvido com ❤️ para estudantes de Direito
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>Termos de Uso</span>
                <span>•</span>
                <span>Política de Privacidade</span>
                <span>•</span>
                <span>Sobre</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
