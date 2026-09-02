import React from 'react';
import { MTGSetEvent } from '../types';
import { Calendar } from 'lucide-react';

interface TimelineNodeProps {
  setEvent: MTGSetEvent;
  onClick: (setEvent: MTGSetEvent) => void;
  position: 'top' | 'bottom';
  isPast: boolean;
}

export function TimelineNode({ setEvent, onClick, position, isPast }: TimelineNodeProps) {
  let badgeColor = 'bg-mtg-blue text-mtg-white';
  const type = setEvent.setType?.toLowerCase() || '';
  
  if (type.includes('commander')) {
    badgeColor = 'bg-mtg-green text-mtg-white';
  } else if (type.includes('masters')) {
    badgeColor = 'bg-mtg-red text-mtg-white';
  } else if (type === 'expansion' || type === 'core') {
    badgeColor = 'bg-mtg-blue text-mtg-white';
  }

  const ContentCard = () => (
    <div 
      className={`w-64 bg-mtg-black-card border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${isPast ? 'border-mtg-white/10 hover:border-mtg-white/40 opacity-80 hover:opacity-100' : 'border-mtg-blue/30 hover:border-mtg-blue shadow-[0_4px_15px_rgba(14,104,171,0.1)]'} ${position === 'top' ? 'hover:-translate-y-1' : 'hover:translate-y-1'}`}
      onClick={() => onClick(setEvent)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-mtg-white/5 rounded-md flex items-center justify-center p-2 border border-mtg-white/10">
          {setEvent.iconUri ? (
            <img src={setEvent.iconUri} alt={setEvent.name} className="w-full h-full filter invert opacity-80" />
          ) : (
            <span className="text-[10px] font-mono font-bold text-mtg-white/50">{setEvent.code.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${badgeColor}`}>
              {setEvent.setType || 'Set'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-mtg-white truncate" title={setEvent.name}>
            {setEvent.name}
          </h3>
          <div className="flex items-center text-xs text-mtg-white/60 mt-1 font-mono">
            <Calendar className="w-3 h-3 mr-1" />
            {setEvent.releaseDate}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-72 shrink-0 relative h-full flex items-center justify-center group">
      {/* Center axis dot */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-mtg-black-card transition-colors duration-300 z-10 ${isPast ? 'border-mtg-white/40' : 'border-mtg-blue shadow-[0_0_8px_rgba(14,104,171,0.8)]'}`}></div>

      {position === 'top' && (
        <div className="absolute bottom-[50%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <ContentCard />
          <div className={`w-0.5 h-8 mt-2 ${isPast ? 'bg-mtg-white/20' : 'bg-mtg-blue/50'}`}></div>
        </div>
      )}

      {position === 'bottom' && (
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className={`w-0.5 h-8 mb-2 ${isPast ? 'bg-mtg-white/20' : 'bg-mtg-blue/50'}`}></div>
          <ContentCard />
        </div>
      )}
    </div>
  );
}
