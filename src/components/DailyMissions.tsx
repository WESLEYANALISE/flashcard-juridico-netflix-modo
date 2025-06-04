
import { useState, useEffect } from 'react';
import { Trophy, Target, Zap, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DailyMission, UserProgress } from '@/types/missions';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DailyMissions = () => {
  const [missions, setMissions] = useLocalStorage<DailyMission[]>('daily_missions', []);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('user_progress', {
    level: 1,
    totalPoints: 0,
    dailyStreak: 0,
    lastStudyDate: null
  });

  const generateDailyMissions = (): DailyMission[] => {
    const today = new Date().toDateString();
    const lastGenerated = localStorage.getItem('missions_generated_date');
    
    if (lastGenerated === today && missions.length > 0) {
      return missions;
    }

    const newMissions: DailyMission[] = [
      {
        id: 'study_10_cards',
        title: 'Estudar Cards',
        description: 'Estude 10 flashcards hoje',
        type: 'study_cards',
        target: 10,
        current: 0,
        completed: false,
        points: 50,
        icon: '📚'
      },
      {
        id: 'correct_5_streak',
        title: 'Sequência de Acertos',
        description: 'Acerte 5 questões consecutivas',
        type: 'correct_answers',
        target: 5,
        current: 0,
        completed: false,
        points: 75,
        icon: '🎯'
      },
      {
        id: 'daily_streak',
        title: 'Manter Sequência',
        description: 'Estude por 3 dias consecutivos',
        type: 'study_streak',
        target: 3,
        current: userProgress.dailyStreak,
        completed: userProgress.dailyStreak >= 3,
        points: 100,
        icon: '🔥'
      }
    ];

    localStorage.setItem('missions_generated_date', today);
    return newMissions;
  };

  useEffect(() => {
    const newMissions = generateDailyMissions();
    setMissions(newMissions);
  }, []);

  const completeMission = (missionId: string) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, completed: true, current: mission.target }
        : mission
    ));

    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      setUserProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + mission.points,
        level: Math.floor((prev.totalPoints + mission.points) / 200) + 1
      }));
    }
  };

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'study_cards': return <Target className="w-6 h-6" />;
      case 'correct_answers': return <Zap className="w-6 h-6" />;
      case 'study_streak': return <Calendar className="w-6 h-6" />;
      default: return <Trophy className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-netflix-red mr-3" />
            <h1 className="text-3xl font-bold text-white">Missões Diárias</h1>
          </div>
          <p className="text-gray-400">Complete desafios e ganhe pontos para evoluir</p>
        </div>

        {/* User Progress */}
        <div className="bg-netflix-dark/50 rounded-2xl p-6 mb-8 glass-effect">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Nível {userProgress.level}</h3>
              <p className="text-gray-400">{userProgress.totalPoints} pontos totais</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-netflix-red">{userProgress.dailyStreak}</div>
              <p className="text-gray-400 text-sm">dias consecutivos</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-netflix-red h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(userProgress.totalPoints % 200) / 2}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {200 - (userProgress.totalPoints % 200)} pontos para o próximo nível
            </p>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <Card key={mission.id} className="bg-netflix-dark/50 border-neutral-700/50 p-6 glass-effect">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="mr-3 text-netflix-red">
                    {getMissionIcon(mission.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                    <p className="text-gray-400 text-sm">{mission.description}</p>
                  </div>
                </div>
                {mission.completed && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progresso</span>
                  <span className="text-white">{mission.current}/{mission.target}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      mission.completed ? 'bg-green-500' : 'bg-netflix-red'
                    }`}
                    style={{ width: `${Math.min((mission.current / mission.target) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-netflix-red font-semibold">{mission.points} pts</span>
                {mission.completed ? (
                  <Button disabled className="bg-green-500/20 text-green-500 cursor-not-allowed">
                    Concluída
                  </Button>
                ) : (
                  <Button 
                    onClick={() => completeMission(mission.id)}
                    variant="outline"
                    className="bg-netflix-red/20 border-netflix-red/50 text-netflix-red hover:bg-netflix-red/30"
                    disabled={mission.current < mission.target}
                  >
                    Resgatar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyMissions;
