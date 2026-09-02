import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex gap-4 text-center mt-4 text-mtg-white font-mono text-2xl sm:text-4xl font-bold bg-mtg-black-card/50 p-4 rounded-lg border border-mtg-red">
      <div className="flex flex-col">
        <span>{pad(timeLeft.days)}</span>
        <span className="text-xs text-mtg-white/70 tracking-widest mt-1">DAYS</span>
      </div>
      <span className="text-mtg-red opacity-50">:</span>
      <div className="flex flex-col">
        <span>{pad(timeLeft.hours)}</span>
        <span className="text-xs text-mtg-white/70 tracking-widest mt-1">HRS</span>
      </div>
      <span className="text-mtg-red opacity-50">:</span>
      <div className="flex flex-col">
        <span>{pad(timeLeft.minutes)}</span>
        <span className="text-xs text-mtg-white/70 tracking-widest mt-1">MIN</span>
      </div>
      <span className="text-mtg-red opacity-50">:</span>
      <div className="flex flex-col">
        <span className="text-mtg-red">{pad(timeLeft.seconds)}</span>
        <span className="text-xs text-mtg-white/70 tracking-widest mt-1">SEC</span>
      </div>
    </div>
  );
}
