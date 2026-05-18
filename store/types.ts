/**
 * Data model types for FilmDB
 */

export type FilmType = 'movie' | 'scene';

export interface Film {
  id: string;
  title: string;
  alternateTitles?: string[];
  type: FilmType;
  year?: number;
  studio?: string;
  posterUri?: string;
  rating?: number;
  isFavorite: boolean;
  categoryIds: string[];
  actressIds: string[];
  notes?: string;
  createdAt: string;
}

export interface Actress {
  id: string;
  name: string;
  alternateNames?: string[];
  birthday?: string;
  nationality?: string;
  photoUri?: string;
  bio?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Preferences {}
