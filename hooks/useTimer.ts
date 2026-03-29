import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  duration: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useTimer({ duration, onExpire, autoStart = false }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
  }, [duration, autoStart]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          clearInterval(interval);
          if (onExpireRef.current) onExpireRef.current();
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
  }, [duration]);
  const restart = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(true);
  }, [duration]);

  const progress = duration > 0 ? timeLeft / duration : 0;

  return { timeLeft, isRunning, progress, start, pause, reset, restart };
}
