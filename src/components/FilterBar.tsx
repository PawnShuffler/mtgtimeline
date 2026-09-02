import React from 'react';
import { CategoryKey } from '../types';

interface FilterBarProps {
  selectedCategories: Set<CategoryKey>;
  onChange: (categories: Set<CategoryKey>) => void;
}

const CATEGORIES: { key: CategoryKey; label: string; styles: string; activeStyles: string }[] = [
  { key: 'expansion', label: 'Expansions', styles: 'border-mtg-blue text-mtg-blue', activeStyles: 'bg-mtg-blue text-mtg-white border-mtg-blue' },
  { key: 'commander', label: 'Commander', styles: 'border-mtg-green text-mtg-green', activeStyles: 'bg-mtg-green text-mtg-white border-mtg-green' },
  { key: 'masters', label: 'Masters / Innovation', styles: 'border-mtg-red text-mtg-red', activeStyles: 'bg-mtg-red text-mtg-white border-mtg-red' },
  { key: 'secret_lair', label: 'Secret Lairs', styles: 'border-mtg-white text-mtg-white', activeStyles: 'bg-mtg-white text-[#150B00] border-mtg-white' }, // Text is mtg-black-bg
  { key: 'extras', label: 'Tokens / Promos', styles: 'border-mtg-white/40 text-mtg-white/80', activeStyles: 'bg-[#211E1E] text-mtg-white border-mtg-white/40' }, // bg is mtg-black-card
  { key: 'news', label: 'News / Articles', styles: 'border-mtg-blue text-mtg-white/80', activeStyles: 'bg-[#150B00] text-mtg-white border-mtg-blue' } // bg is mtg-black-bg
];

export const FilterBar: React.FC<FilterBarProps> = ({ selectedCategories, onChange }) => {
  const handleToggle = (key: CategoryKey) => {
    const next = new Set(selectedCategories);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    onChange(next);
  };

  const handleSelectAll = () => {
    onChange(new Set(CATEGORIES.map(c => c.key)));
  };

  const handleClear = () => {
    onChange(new Set());
  };

  return (
    <div className="sticky top-0 z-50 bg-mtg-black-bg/95 backdrop-blur-md border-b border-mtg-white/10 py-3 shadow-md mb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map(({ key, label, styles, activeStyles }) => {
              const isActive = selectedCategories.has(key);
              return (
                <button
                  key={key}
                  onClick={() => handleToggle(key)}
                  className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full border-2 transition-colors duration-200 ${
                    isActive ? activeStyles : `bg-transparent hover:bg-opacity-20 ${styles}`
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleSelectAll}
              className="text-xs text-mtg-white/70 hover:text-mtg-white underline transition-colors"
            >
              Select All
            </button>
            <span className="text-mtg-white/30">|</span>
            <button 
              onClick={handleClear}
              className="text-xs text-mtg-white/70 hover:text-mtg-white underline transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
