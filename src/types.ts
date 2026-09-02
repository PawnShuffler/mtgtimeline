export interface MTGSetEvent {
  type: 'set';
  id: string;
  name: string;
  code: string;
  releaseDate: string;
  iconUri: string;
  cardCount: number;
  setType: string;
}

export interface MTGAnnouncementEvent {
  type: 'announcement';
  title: string;
  url: string;
  releaseDate: string;
}

export type MTGEvent = MTGSetEvent | MTGAnnouncementEvent;
