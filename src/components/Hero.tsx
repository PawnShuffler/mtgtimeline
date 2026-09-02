import React, { useState, useEffect } from 'react';
import { MTGSetEvent } from '../types';
import { Countdown } from './Countdown';
import { Calendar } from 'lucide-react';

interface HeroProps {
  nextSet: MTGSetEvent | null;
}

export function Hero({ nextSet }: HeroProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [nextSet?.iconUri]);

  if (!nextSet) return null;

  return (
    <section className="relative overflow-hidden rounded-xl border-2 border-mtg-red bg-mtg-black-card p-6 sm:p-12 mb-12 shadow-[0_0_20px_rgba(211,32,42,0.15)] flex flex-col items-center justify-center text-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mtg-red via-mtg-white to-mtg-red opacity-30"></div>
      
      <div className="uppercase tracking-widest text-mtg-red font-bold text-sm mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Next Release
      </div>
      
      <div className="flex flex-col items-center mb-6">
        {nextSet.iconUri && !imageError ? (
          <img 
            src={nextSet.iconUri} 
            alt={`${nextSet.name} Icon`} 
            className="w-16 h-16 sm:w-24 sm:h-24 mb-4 filter invert drop-shadow-[0_0_10px_rgba(255,251,213,0.2)]"
            onError={() => setImageError(true)} 
          />
        ) : (
          <div className="w-16 h-16 sm:w-24 sm:h-24 mb-4 bg-mtg-white/10 rounded-full flex items-center justify-center text-mtg-white/50 border border-mtg-white/20 font-mono text-xl sm:text-2xl font-bold">
            {nextSet.code.toUpperCase()}
          </div>
        )}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-mtg-white mb-2">
          {nextSet.name}
        </h2>
        <p className="text-xl text-mtg-white/80">
          Set Code: <span className="font-mono text-mtg-red">{nextSet.code.toUpperCase()}</span>
        </p>
      </div>

      <Countdown targetDate={nextSet.releaseDate} />
    </section>
  );
}
