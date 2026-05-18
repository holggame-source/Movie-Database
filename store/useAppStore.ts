import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Film, Actress, Category } from './types';

// Simple UUID generator that works cross-platform
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface AppState {
  films: Film[];
  actresses: Actress[];
  categories: Category[];

  // Film actions
  addFilm: (film: Omit<Film, 'id' | 'createdAt'>) => string;
  updateFilm: (id: string, updates: Partial<Film>) => void;
  deleteFilm: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Actress actions
  addActress: (actress: Omit<Actress, 'id' | 'createdAt'>) => string;
  updateActress: (id: string, updates: Partial<Actress>) => void;
  deleteActress: (id: string) => void;

  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => string;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Anal', color: '#E94560', createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Milf', color: '#FF6B35', createdAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Asian', color: '#7B68EE', createdAt: new Date().toISOString() },
  { id: 'cat-4', name: 'POV', color: '#00CED1', createdAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Amateur', color: '#32CD32', createdAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Ebony', color: '#FF69B4', createdAt: new Date().toISOString() },
  { id: 'cat-7', name: 'Lesbian', color: '#DA70D6', createdAt: new Date().toISOString() },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      films: [],
      actresses: [],
      categories: DEFAULT_CATEGORIES,

      addFilm: (film) => {
        const id = generateId();
        set((state) => ({
          films: [...state.films, { ...film, id, createdAt: new Date().toISOString() }],
        }));
        return id;
      },

      updateFilm: (id, updates) => {
        set((state) => ({
          films: state.films.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }));
      },

      deleteFilm: (id) => {
        set((state) => ({
          films: state.films.filter((f) => f.id !== id),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          films: state.films.map((f) =>
            f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
          ),
        }));
      },

      addActress: (actress) => {
        const id = generateId();
        set((state) => ({
          actresses: [...state.actresses, { ...actress, id, createdAt: new Date().toISOString() }],
        }));
        return id;
      },

      updateActress: (id, updates) => {
        set((state) => ({
          actresses: state.actresses.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));
      },

      deleteActress: (id) => {
        set((state) => ({
          actresses: state.actresses.filter((a) => a.id !== id),
        }));
      },

      addCategory: (category) => {
        const id = generateId();
        set((state) => ({
          categories: [...state.categories, { ...category, id, createdAt: new Date().toISOString() }],
        }));
        return id;
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          films: state.films.map((f) => ({
            ...f,
            categoryIds: f.categoryIds.filter((cId) => cId !== id),
          })),
        }));
      },
    }),
    {
      name: 'filmdb-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
