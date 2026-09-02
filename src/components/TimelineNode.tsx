import React, { useState, useEffect } from 'react';
import { MTGSetEvent } from '../types';
import { Calendar } from 'lucide-react';

interface TimelineNodeProps {
  setEvent: MTGSetEvent;
  onClick: (setEvent: MTGSetEvent) => void;
  isPast: boolean;
}

export function TimelineNode({ setEvent, onClick, isPast }: TimelineNodeProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [setEvent.iconUri]);

  let badgeColor = 'bg-mtg-blue text-mtg-white'; // default
  const type = setEvent.setType.toLowerCase();
  
  if (type.includes('commander')) {
    badgeColor = 'bg-mtg-green text-mtg-white';
  } else if (type.includes('masters')) {
    badgeColor = 'bg-mtg-red text-mtg-white';
  } else if (type === 'expansion' || type === 'core') {
    badgeColor = 'bg-mtg-blue text-mtg-white';
  }

  return (
    <div 
      className={`relative pl-8 sm:pl-12 py-6 group cursor-pointer border-l-2 ${isPast ? 'border-mtg-white/20' : 'border-mtg-blue/50'}`}
      onClick={() => onClick(setEvent)}
    >
      <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-8 border-2 bg-mtg-black-card transition-colors duration-300 ${isPast ? 'border-mtg-white/40 group-hover:border-mtg-white' : 'border-mtg-blue shadow-[0_0_8px_rgba(14,104,171,0.8)] group-hover:bg-mtg-blue'}`}></div>
      
      <div className={`bg-mtg-black-card border rounded-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isPast ? 'border-mtg-white/10 hover:border-mtg-white/40' : 'border-mtg-blue/30 hover:border-mtg-blue shadow-[0_4px_15px_rgba(14,104,171,0.1)]'}`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-mtg-white/5 rounded-md flex items-center justify-center p-2 border border-mtg-white/10">
              {setEvent.iconUri && !imageError ? (
                <img 
                  src={setEvent.iconUri} 
                  alt={setEvent.name} 
                  className="w-full h-full filter invert opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-xs font-mono font-bold text-mtg-white/50">{setEvent.code.toUpperCase()}</span>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${badgeColor}`}>
                  {setEvent.setType || 'Set'}
                </span>
                <span className="text-xs text-mtg-white/60 font-mono">
                  {setEvent.code.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-mtg-white group-hover:text-mtg-blue transition-colors">
                {setEvent.name}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-mtg-white/70 font-medium whitespace-nowrap bg-mtg-black-bg/50 px-3 py-1.5 rounded-full border border-mtg-white/5">
            <Calendar className="w-4 h-4 mr-2 opacity-70" />
            {setEvent.releaseDate}
          </div>
        </div>
      </div>
    </div>
  );
}
