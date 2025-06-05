
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Lock, User, ArrowRight, Scale, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = '/';
      }
    };
    checkAuth();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Erro de login",
              description: "Email ou senha incorretos. Verifique suas credenciais.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro de login",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Login realizado!",
            description: "Bem-vindo de volta!",
          });
          window.location.href = '/';
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Usuário já existe",
              description: "Este email já está cadastrado. Tente fazer login.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro de cadastro",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Cadastro realizado!",
            description: "Bem-vindo! Você pode começar a estudar agora.",
          });
          window.location.href = '/';
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-netflix-black via-gray-900 to-netflix-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-netflix-red/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-netflix-gold/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-netflix-red/20 rounded-2xl border border-netflix-red/30">
              <Scale className="w-12 h-12 text-netflix-red" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Direito<span className="text-netflix-red">Flash</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Seu companheiro de estudos jurídicos
          </p>
        </div>

        {/* Auth Card */}
        <Card className="bg-netflix-dark/90 border-white/20 backdrop-blur-xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Fazer Login' : 'Criar Conta'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Acesse sua conta para continuar estudando' 
                : 'Crie sua conta e comece a estudar agora'
              }
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-netflix-red"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-netflix-red"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold py-3 transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </p>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-netflix-red hover:text-netflix-red/80 font-semibold"
            >
              {isLogin ? 'Criar conta' : 'Fazer login'}
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-center justify-center">
              <BookOpen className="w-4 h-4 mr-2 text-netflix-red" />
              Flashcards Interativos
            </div>
            <div className="flex items-center justify-center">
              <Scale className="w-4 h-4 mr-2 text-netflix-red" />
              Conteúdo Jurídico
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
