import React, { useEffect, useState } from 'react';
import { MTGSetEvent } from '../types';
import { X, ExternalLink, Calendar, Layers } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setEvent: MTGSetEvent | null;
}

export function Drawer({ isOpen, onClose, setEvent }: DrawerProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [setEvent?.iconUri]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!setEvent) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-mtg-black-bg/80 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-mtg-black-card border-l border-mtg-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-mtg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mtg-blue via-mtg-green to-mtg-red"></div>
            <h2 className="text-2xl font-bold text-mtg-white pr-8">
              {setEvent.name}
            </h2>
            <button 
              onClick={onClose}
              className="text-mtg-white/60 hover:text-mtg-white hover:bg-mtg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 flex-grow flex flex-col gap-8">
            <div className="flex justify-center py-8">
              {setEvent.iconUri && !imageError ? (
                <img 
                  src={setEvent.iconUri} 
                  alt={setEvent.name} 
                  className="w-32 h-32 filter invert opacity-90 drop-shadow-[0_0_15px_rgba(255,251,213,0.1)]" 
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-32 h-32 bg-mtg-black-bg rounded-xl border border-mtg-white/20 flex items-center justify-center text-4xl font-mono text-mtg-white/30 font-bold">
                  {setEvent.code.toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-mtg-black-bg rounded-lg border border-mtg-white/5">
                <div className="flex items-center text-mtg-white/60">
                  <Calendar className="w-5 h-5 mr-3 text-mtg-blue" />
                  Release Date
                </div>
                <div className="font-medium text-mtg-white">
                  {setEvent.releaseDate}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-mtg-black-bg rounded-lg border border-mtg-white/5">
                <div className="flex items-center text-mtg-white/60">
                  <span className="font-mono text-mtg-red mr-3 text-lg font-bold">#</span>
                  Set Code
                </div>
                <div className="font-mono font-bold text-mtg-white uppercase">
                  {setEvent.code}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-mtg-black-bg rounded-lg border border-mtg-white/5">
                <div className="flex items-center text-mtg-white/60">
                  <Layers className="w-5 h-5 mr-3 text-mtg-green" />
                  Card Count
                </div>
                <div className="font-medium text-mtg-white">
                  {setEvent.cardCount > 0 ? setEvent.cardCount : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-mtg-white/10 bg-mtg-black-bg">
            <a 
              href={`https://scryfall.com/sets/${setEvent.code}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 bg-mtg-white text-mtg-black-bg font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
            >
              View on Scryfall
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
