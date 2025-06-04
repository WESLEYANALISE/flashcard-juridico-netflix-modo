
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-8 border border-neutral-700/50 shadow-2xl">
              <AlertTriangle className="w-16 h-16 text-netflix-red mx-auto mb-6" />
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Oops! Algo deu errado
              </h2>
              
              <p className="text-neutral-400 mb-6">
                Encontramos um problema inesperado. Tente recarregar a página ou volte ao início.
              </p>

              {this.state.error && (
                <details className="text-left mb-6">
                  <summary className="text-neutral-500 cursor-pointer hover:text-neutral-400 transition-colors">
                    Detalhes técnicos
                  </summary>
                  <pre className="text-xs text-neutral-600 mt-2 overflow-auto max-h-32 bg-neutral-950 p-3 rounded">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="bg-netflix-red hover:bg-netflix-red/80 text-white flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
