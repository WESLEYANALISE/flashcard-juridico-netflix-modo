
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseErrorHandlingOptions {
  showToast?: boolean;
  retryLimit?: number;
}

export const useErrorHandling = (options: UseErrorHandlingOptions = {}) => {
  const { showToast = true, retryLimit = 3 } = options;
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error: Error | unknown, context?: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    if (showToast) {
      toast({
        title: "Erro",
        description: `${context ? `${context}: ` : ''}${errorMessage}`,
        variant: "destructive",
      });
    }
  }, [showToast]);

  const retry = useCallback(async (fn: () => Promise<any>) => {
    if (retryCount >= retryLimit) {
      handleError(new Error('Limite de tentativas excedido'));
      return;
    }

    setIsRetrying(true);
    try {
      const result = await fn();
      setRetryCount(0);
      return result;
    } catch (error) {
      setRetryCount(prev => prev + 1);
      handleError(error, 'Tentativa de retry');
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, retryLimit, handleError]);

  const resetRetry = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    handleError,
    retry,
    resetRetry,
    retryCount,
    isRetrying,
    canRetry: retryCount < retryLimit
  };
};
