import { useState, useEffect } from 'react';
import { MTGEvent } from '../types';

const MOCK_DATA: MTGEvent[] = [
  {
    type: 'set',
    id: 'mock-past-1',
    name: 'Mock Expansion Set',
    code: 'M24',
    releaseDate: '2023-09-01',
    iconUri: '',
    cardCount: 281,
    setType: 'expansion'
  },
  {
    type: 'set',
    id: 'mock-past-2',
    name: 'Mock Commander Decks',
    code: 'CMD',
    releaseDate: '2024-01-15',
    iconUri: '',
    cardCount: 150,
    setType: 'commander'
  },
  {
    type: 'set',
    id: 'mock-next',
    name: 'Next Masters Set',
    code: 'NMS',
    releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    iconUri: '',
    cardCount: 300,
    setType: 'masters'
  },
  {
    type: 'set',
    id: 'mock-future',
    name: 'Future Core Set',
    code: 'M26',
    releaseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    iconUri: '',
    cardCount: 275,
    setType: 'core'
  }
];

export function useEvents() {
  const [events, setEvents] = useState<MTGEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const basePath = import.meta.env.BASE_URL || '/';
        const response = await fetch(`${basePath}data/events.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.warn('Failed to load events.json, falling back to mock data', err);
        setEvents(MOCK_DATA);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}
