import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useEvents } from './hooks/useEvents';
import { Hero } from './components/Hero';
import { TimelineNode } from './components/TimelineNode';
import { Drawer } from './components/Drawer';
import { MTGSetEvent } from './types';
import { Search } from 'lucide-react';

function App() {
  const { events, loading } = useEvents();
  const [selectedSet, setSelectedSet] = useState<MTGSetEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const todayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLElement>(null);

  const sets = useMemo(() => {
    return events.filter((e): e is MTGSetEvent => e.type === 'set');
  }, [events]);

  const { sortedSets, nextSet, todayIndex } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Sort ascending (oldest on the left, newest on the right)
    const sorted = [...sets].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
    
    let next: MTGSetEvent | null = null;
    let idx = sorted.length;
    
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].releaseDate > today) {
        if (!next) {
          next = sorted[i];
          idx = i;
        }
      }
    }

    return { 
      sortedSets: sorted, 
      nextSet: next,
      todayIndex: idx
    };
  }, [sets]);

  const filteredSets = useMemo(() => {
    if (!searchQuery) return sortedSets;
    const lowerQ = searchQuery.toLowerCase();
    return sortedSets.filter(set => 
      set.name.toLowerCase().includes(lowerQ) || 
      set.releaseDate.includes(lowerQ)
    );
  }, [sortedSets, searchQuery]);

  useEffect(() => {
    if (!loading && todayRef.current) {
      // Scroll to center the today marker
      todayRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [loading, filteredSets.length]); // Scroll on initial load or search clear

  useEffect(() => {
    if (loading) return; // Wait until loading is done and DOM is rendered
    
    const container = timelineRef.current;
    if (!container) return;
    
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      // If pressing shift, let the browser handle it naturally
      if (e.shiftKey) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY * 1.5;
    };
    
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-mtg-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-mtg-blue text-xl font-bold mt-4 tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const todayDateIso = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl shrink-0">
        <Hero nextSet={nextSet} />
        
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-mtg-white">
            TIMELINE
          </h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-mtg-white/50" />
            </div>
            <input
              type="text"
              className="bg-mtg-black-card border border-mtg-white/20 text-mtg-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-mtg-blue focus:ring-1 focus:ring-mtg-blue transition-colors placeholder-mtg-white/30"
              placeholder="Search by name or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main ref={timelineRef} className="relative w-full overflow-x-auto hide-scrollbar pt-8 pb-16 flex-1">
        <div className="flex flex-row items-center px-4 sm:px-[10vw] relative z-10 w-max min-w-full h-[500px]">
          {/* Central Axis Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0 border-t-2 border-mtg-blue/50 z-0"></div>
          {filteredSets.map((set, index) => {
            const isPast = set.releaseDate <= todayDateIso;
            
            // Insert TODAY marker if this is the first upcoming set
            // and we haven't filtered it out (or we are not searching)
            const showTodayBeforeThis = !searchQuery && index === todayIndex;

            return (
              <React.Fragment key={set.id}>
                {showTodayBeforeThis && (
                  <div ref={todayRef} className="flex flex-col items-center justify-center shrink-0 px-4 h-full relative z-20">
                    {/* Full height TODAY line */}
                    <div className="w-1 h-full bg-mtg-red self-center relative flex justify-center shadow-[0_0_15px_rgba(211,32,42,0.5)]">
                       {/* Centered Badge */}
                       <div className="absolute top-1/2 -translate-y-1/2 bg-mtg-black-bg border-2 border-mtg-red px-4 py-2 rounded text-mtg-red font-bold tracking-widest text-sm flex flex-col items-center whitespace-nowrap shadow-[0_0_10px_rgba(211,32,42,0.3)] z-30">
                         <span>TODAY</span>
                         <span className="text-xs opacity-80 font-mono">{todayDateStr}</span>
                       </div>
                    </div>
                  </div>
                )}
                
                <TimelineNode 
                  setEvent={set} 
                  onClick={setSelectedSet}
                  position={index % 2 === 0 ? 'top' : 'bottom'}
                  isPast={isPast} 
                />
              </React.Fragment>
            );
          })}
          
          {/* Handle edge case where TODAY is after the very last set */}
          {!searchQuery && todayIndex === filteredSets.length && (
            <div ref={todayRef} className="flex flex-col items-center justify-center shrink-0 px-4 h-full relative z-20">
              <div className="w-1 h-full bg-mtg-red self-center relative flex justify-center shadow-[0_0_15px_rgba(211,32,42,0.5)]">
                 <div className="absolute top-1/2 -translate-y-1/2 bg-mtg-black-bg border-2 border-mtg-red px-4 py-2 rounded text-mtg-red font-bold tracking-widest text-sm flex flex-col items-center whitespace-nowrap shadow-[0_0_10px_rgba(211,32,42,0.3)] z-30">
                   <span>TODAY</span>
                   <span className="text-xs opacity-80 font-mono">{todayDateStr}</span>
                 </div>
              </div>
            </div>
          )}

          {filteredSets.length === 0 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-mtg-white/50 italic">
              No sets found matching your search.
            </div>
          )}
        </div>
      </main>

      <Drawer 
        isOpen={!!selectedSet} 
        onClose={() => setSelectedSet(null)} 
        setEvent={selectedSet} 
      />
    </div>
  );
}

export default App;
