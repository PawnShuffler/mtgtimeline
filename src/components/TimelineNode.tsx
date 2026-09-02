import React from 'react';
import { MTGEvent, MTGSetEvent } from '../types';
import { Calendar, Newspaper } from 'lucide-react';

interface TimelineNodeProps {
  event: MTGEvent;
  onClick: (event: MTGEvent) => void;
  position: 'top' | 'bottom';
  isPast: boolean;
}

export function TimelineNode({ event, onClick, position, isPast }: TimelineNodeProps) {
  let badgeColor = 'bg-mtg-blue text-mtg-white';
  
  if (event.category === 'commander') {
    badgeColor = 'bg-mtg-green text-mtg-white';
  } else if (event.category === 'masters') {
    badgeColor = 'bg-mtg-red text-mtg-white';
  } else if (event.category === 'secret_lair') {
    badgeColor = 'bg-mtg-white text-[#150B00]';
  } else if (event.category === 'extras') {
    badgeColor = 'bg-mtg-black-bg text-mtg-white border border-mtg-white/40';
  } else if (event.category === 'news') {
    badgeColor = 'bg-mtg-black-bg text-mtg-blue border border-mtg-blue';
  }

  const isCompact = event.category === 'extras';
  const isNews = event.category === 'news';
  const isSet = event.type === 'set';

  const ContentCard = () => (
    <div 
      className={`${isCompact ? 'w-48 p-2' : 'w-64 p-4'} bg-mtg-black-card border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${isPast ? 'border-mtg-white/10 hover:border-mtg-white/40 opacity-80 hover:opacity-100' : 'border-mtg-blue/30 hover:border-mtg-blue shadow-[0_4px_15px_rgba(14,104,171,0.1)]'} ${position === 'top' ? 'hover:-translate-y-1' : 'hover:translate-y-1'}`}
      onClick={() => onClick(event)}
    >
      <div className={`flex ${isCompact ? 'items-center' : 'items-start'} gap-3`}>
        {!isCompact && (
          <div className="flex-shrink-0 w-12 h-12 bg-mtg-white/5 rounded-md flex items-center justify-center p-2 border border-mtg-white/10">
            {isSet && (event as MTGSetEvent).iconUri ? (
              <img src={(event as MTGSetEvent).iconUri} alt={event.name} className="w-full h-full filter invert opacity-80" />
            ) : isNews ? (
              <Newspaper className="w-6 h-6 text-mtg-blue/80" />
            ) : (
              <span className="text-[10px] font-mono font-bold text-mtg-white/50">{isSet ? (event as MTGSetEvent).code.toUpperCase() : ''}</span>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${badgeColor}`}>
              {isSet ? (event as MTGSetEvent).setType || 'Set' : 'News'}
            </span>
          </div>
          <h3 className={`${isCompact ? 'text-xs' : 'text-sm'} font-bold text-mtg-white truncate`} title={event.name}>
            {event.name}
          </h3>
          <div className={`flex items-center ${isCompact ? 'text-[10px]' : 'text-xs'} text-mtg-white/60 mt-1 font-mono`}>
            <Calendar className={`${isCompact ? 'w-2.5 h-2.5' : 'w-3 h-3'} mr-1`} />
            {event.releaseDate}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${isCompact ? 'w-52' : 'w-72'} shrink-0 relative h-full flex items-center justify-center group`}>
      {/* Center axis dot */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-mtg-black-card transition-colors duration-300 z-10 ${isPast ? 'border-mtg-white/40' : 'border-mtg-blue shadow-[0_0_8px_rgba(14,104,171,0.8)]'}`}></div>

      {position === 'top' && (
        <div className="absolute bottom-[50%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <ContentCard />
          <div className={`w-0.5 mt-2 ${isCompact ? 'h-4' : 'h-8'} ${isPast ? 'bg-mtg-white/20' : 'bg-mtg-blue/50'}`}></div>
        </div>
      )}

      {position === 'bottom' && (
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className={`w-0.5 mb-2 ${isCompact ? 'h-4' : 'h-8'} ${isPast ? 'bg-mtg-white/20' : 'bg-mtg-blue/50'}`}></div>
          <ContentCard />
        </div>
      )}
    </div>
  );
}
