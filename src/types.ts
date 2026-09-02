export type CategoryKey = 'expansion' | 'commander' | 'masters' | 'secret_lair' | 'extras' | 'news';

export interface MTGSetEvent {
  type: 'set';
  id: string;
  name: string;
  code: string;
  releaseDate: string;
  iconUri: string;
  cardCount: number;
  setType: string;
  category: CategoryKey;
}

export interface MTGAnnouncementEvent {
  type: 'announcement';
  id: string;
  name: string;
  link: string;
  releaseDate: string;
  category: CategoryKey;
}

export type MTGEvent = MTGSetEvent | MTGAnnouncementEvent;
