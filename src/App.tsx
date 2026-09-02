import React, { useState, useMemo, useRef } from 'react';
import { useEvents } from './hooks/useEvents';
import { Hero } from './components/Hero';
import { TimelineNode } from './components/TimelineNode';
import { Drawer } from './components/Drawer';
import { MTGSetEvent } from './types';
import { Search, ArrowDownToLine } from 'lucide-react';

function App() {
  const { events, loading } = useEvents();
  const [selectedSet, setSelectedSet] = useState<MTGSetEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const todayRef = useRef<HTMLDivElement>(null);

  const sets = useMemo(() => {
    return events.filter((e): e is MTGSetEvent => e.type === 'set');
  }, [events]);

  const { pastSets, upcomingSets } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const past: MTGSetEvent[] = [];
    const upcoming: MTGSetEvent[] = [];

    sets.forEach(set => {
      if (set.releaseDate <= today) {
        past.push(set);
      } else {
        upcoming.push(set);
      }
    });

    return { 
      pastSets: past.reverse(), 
      upcomingSets: upcoming
    };
  }, [sets]);

  const nextSet = upcomingSets.length > 0 ? upcomingSets[0] : null;

  const filterSets = (setsToFilter: MTGSetEvent[]) => {
    return setsToFilter.filter(set => {
      // Search filter
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        if (!set.name.toLowerCase().includes(lowerQ) && !set.releaseDate.includes(lowerQ)) {
          return false;
        }
      }
      // Type filter
      if (activeFilter !== 'All') {
        const t = set.setType.toLowerCase();
        if (activeFilter === 'Standard/Expansions') {
          if (!t.includes('expansion') && !t.includes('core')) return false;
        } else if (activeFilter === 'Commander') {
          if (!t.includes('commander')) return false;
        } else if (activeFilter === 'Masters/Remastered') {
          if (!t.includes('masters') && !t.includes('remastered')) return false;
        }
      }
      return true;
    });
  };

  const filteredPastSets = useMemo(() => filterSets(pastSets), [pastSets, searchQuery, activeFilter]);
  const filteredUpcomingSets = useMemo(() => filterSets(upcomingSets), [upcomingSets, searchQuery, activeFilter]);

  const scrollToToday = () => {
    if (todayRef.current) {
      const yOffset = -100; 
      const y = todayRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse flex flex-col items-center mb-12">
          <div className="w-full h-[300px] bg-mtg-black-card border-2 border-mtg-white/10 rounded-xl mb-4"></div>
        </div>
        <div className="space-y-8 pl-8 sm:pl-12 relative">
          <div className="absolute left-[15px] sm:left-[23px] top-0 bottom-0 w-0.5 bg-mtg-black-card"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="relative bg-mtg-black-card border border-mtg-white/10 rounded-lg p-5 h-24 w-full">
               <div className="absolute w-4 h-4 rounded-full -left-[33px] sm:-left-[41px] top-8 bg-mtg-black-card border-2 border-mtg-white/20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <Hero nextSet={nextSet} />

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-mtg-black-bg/95 backdrop-blur-md border-b border-mtg-white/10 py-4 mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-wrap gap-2 justify-center">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${activeFilter === 'All' ? 'bg-mtg-white text-mtg-black-bg border-mtg-white' : 'bg-transparent text-mtg-white/70 border-mtg-white/20 hover:border-mtg-white/50'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('Standard/Expansions')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${activeFilter === 'Standard/Expansions' ? 'bg-mtg-blue text-mtg-white border-mtg-blue' : 'bg-transparent text-mtg-blue border-mtg-blue/30 hover:border-mtg-blue'}`}
          >
            Standard/Expansions
          </button>
          <button 
            onClick={() => setActiveFilter('Commander')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${activeFilter === 'Commander' ? 'bg-mtg-green text-mtg-white border-mtg-green' : 'bg-transparent text-mtg-green border-mtg-green/30 hover:border-mtg-green'}`}
          >
            Commander
          </button>
          <button 
            onClick={() => setActiveFilter('Masters/Remastered')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${activeFilter === 'Masters/Remastered' ? 'bg-mtg-red text-mtg-white border-mtg-red' : 'bg-transparent text-mtg-red border-mtg-red/30 hover:border-mtg-red'}`}
          >
            Masters/Remastered
          </button>
        </div>
        <button 
          onClick={scrollToToday}
          className="flex items-center gap-2 text-mtg-white hover:text-mtg-red text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Jump to Today
        </button>
      </div>

      <main className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[15px] sm:left-[23px] top-0 bottom-0 w-0.5 bg-mtg-white/10"></div>

        {/* Upcoming Section */}
        {filteredUpcomingSets.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-mtg-white mb-8 pl-12 flex items-center">
              <span className="text-mtg-blue mr-3">UPCOMING</span> RELEASES
            </h2>
            <div className="flex flex-col gap-4">
              {filteredUpcomingSets.map(set => (
                <TimelineNode 
                  key={set.id} 
                  setEvent={set} 
                  onClick={setSelectedSet}
                  isPast={false} 
                />
              ))}
            </div>
          </div>
        )}

        {/* TODAY Divider */}
        <div ref={todayRef} className="relative flex items-center mb-16 pl-8 sm:pl-12 scroll-mt-24">
          <div className="absolute left-[-5px] sm:left-[3px] w-10 h-1 bg-mtg-red"></div>
          <div className="bg-mtg-black-bg border-2 border-mtg-red text-mtg-red font-bold px-6 py-2 rounded-full tracking-widest shadow-[0_0_15px_rgba(211,32,42,0.3)] z-10">
            TODAY
          </div>
        </div>

        {/* Past Section */}
        <div>
          <div className="pl-8 sm:pl-12 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-mtg-white flex items-center">
              <span className="text-mtg-white/50 mr-3">PAST</span> ERAS & SETS
            </h2>
            
            <div className="relative z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-mtg-white/50" />
              </div>
              <input
                type="text"
                className="bg-mtg-black-card border border-mtg-white/20 text-mtg-white rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:border-mtg-blue focus:ring-1 focus:ring-mtg-blue transition-colors placeholder-mtg-white/30"
                placeholder="Search by name or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {filteredPastSets.map(set => (
              <TimelineNode 
                key={set.id} 
                setEvent={set} 
                onClick={setSelectedSet}
                isPast={true}
              />
            ))}
            
            {filteredPastSets.length === 0 && (
              <div className="pl-12 py-8 text-mtg-white/50 italic">
                No past sets found matching your search and filter.
              </div>
            )}
          </div>
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
