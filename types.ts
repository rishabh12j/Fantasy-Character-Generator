export interface TcgStats {
  health: number;
  mana: number;
  strength: number;
}

export interface Character {
  id: string; // Added ID for deck management
  name: string;
  characterClass: string;
  race: string;
  title: string;
  alignment: string;
  bio: string;
  skills: string[];
  tcgStats: TcgStats;
  imageUrl?: string;
}