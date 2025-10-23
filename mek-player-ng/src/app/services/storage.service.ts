import { Injectable, signal } from '@angular/core';
import { BookListItem } from '../models/book.model';

export interface PlaybackState {
  bookId: string;
  chapterIndex: number;
  currentTime: number;
  timestamp: number;
  totalChapters?: number;
  chapterDuration?: number;
  completedChapters?: number[];
}

export interface RecentBook {
  id: string;
  title: string;
  author: string;
  cover?: string;
  timestamp: number;
}

export interface BookPlaybackStates {
  [bookId: string]: PlaybackState;
}

export interface UserSettings {
  playbackSpeed: number;
  viewMode: 'table' | 'grid';
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PLAYBACK_STATES_KEY = 'mek_playback_states';
  private readonly CURRENT_BOOK_KEY = 'mek_current_book';
  private readonly FAVORITES_KEY = 'mek_favorites';
  private readonly RECENT_KEY = 'mek_recent_books';
  private readonly SETTINGS_KEY = 'mek_settings';
  private readonly CACHE_KEY_PREFIX = 'mek_cache_';
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000;

  favorites = signal<string[]>([]);
  recentBooks = signal<RecentBook[]>([]);
  playbackStates = signal<BookPlaybackStates>({});
  currentBookId = signal<string | null>(null);
  settings = signal<UserSettings>({ playbackSpeed: 1, viewMode: 'table' });

  constructor() {
    this.loadFavorites();
    this.loadRecentBooks();
    this.loadPlaybackStates();
    this.loadCurrentBook();
    this.loadSettings();
  }

  savePlaybackState(state: PlaybackState): void {
    try {
      const states = this.playbackStates();
      states[state.bookId] = { ...state, timestamp: Date.now() };
      this.playbackStates.set({ ...states });
      localStorage.setItem(this.PLAYBACK_STATES_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Error saving playback state:', error);
    }
  }

  getPlaybackState(bookId?: string): PlaybackState | null {
    try {
      if (bookId) {
        return this.playbackStates()[bookId] || null;
      }
      const currentId = this.currentBookId();
      return currentId ? this.playbackStates()[currentId] || null : null;
    } catch (error) {
      console.error('Error loading playback state:', error);
      return null;
    }
  }

  getCurrentBookPlaybackState(): PlaybackState | null {
    const currentId = this.currentBookId();
    return currentId ? this.getPlaybackState(currentId) : null;
  }

  setCurrentBook(bookId: string | null): void {
    this.currentBookId.set(bookId);
    try {
      if (bookId) {
        localStorage.setItem(this.CURRENT_BOOK_KEY, bookId);
      } else {
        localStorage.removeItem(this.CURRENT_BOOK_KEY);
      }
    } catch (error) {
      console.error('Error saving current book:', error);
    }
  }

  private loadCurrentBook(): void {
    try {
      const bookId = localStorage.getItem(this.CURRENT_BOOK_KEY);
      this.currentBookId.set(bookId);
    } catch (error) {
      console.error('Error loading current book:', error);
    }
  }

  private loadPlaybackStates(): void {
    try {
      const data = localStorage.getItem(this.PLAYBACK_STATES_KEY);
      const states = data ? JSON.parse(data) : {};
      this.playbackStates.set(states);
    } catch (error) {
      console.error('Error loading playback states:', error);
      this.playbackStates.set({});
    }
  }

  clearPlaybackState(bookId?: string): void {
    try {
      if (bookId) {
        const states = this.playbackStates();
        delete states[bookId];
        this.playbackStates.set({ ...states });
        localStorage.setItem(this.PLAYBACK_STATES_KEY, JSON.stringify(states));
      } else {
        this.playbackStates.set({});
        localStorage.removeItem(this.PLAYBACK_STATES_KEY);
      }
    } catch (error) {
      console.error('Error clearing playback state:', error);
    }
  }

  hasPlaybackState(bookId: string): boolean {
    return !!this.playbackStates()[bookId];
  }

  getPlaybackProgress(bookId: string): { chapterIndex: number; currentTime: number; progress: number } | null {
    const state = this.getPlaybackState(bookId);
    if (!state) return null;
    
    const completedChapters = state.completedChapters?.length || 0;
    const totalChapters = state.totalChapters || 1;
    const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
    
    return {
      chapterIndex: state.chapterIndex,
      currentTime: state.currentTime,
      progress
    };
  }

  markChapterCompleted(bookId: string, chapterIndex: number): void {
    const state = this.getPlaybackState(bookId);
    if (!state) return;

    const completedChapters = state.completedChapters || [];
    if (!completedChapters.includes(chapterIndex)) {
      completedChapters.push(chapterIndex);
      this.savePlaybackState({
        ...state,
        completedChapters
      });
    }
  }

  isChapterCompleted(bookId: string, chapterIndex: number): boolean {
    const state = this.getPlaybackState(bookId);
    return state?.completedChapters?.includes(chapterIndex) || false;
  }

  saveSettings(settings: Partial<UserSettings>): void {
    try {
      const current = this.settings();
      const updated = { ...current, ...settings };
      this.settings.set(updated);
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  private loadSettings(): void {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      if (data) {
        this.settings.set(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  private loadFavorites(): void {
    try {
      const data = localStorage.getItem(this.FAVORITES_KEY);
      const favorites = data ? JSON.parse(data) : [];
      this.favorites.set(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites.set([]);
    }
  }

  toggleFavorite(bookId: string): boolean {
    const favorites = this.favorites();
    const index = favorites.indexOf(bookId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(bookId);
    }
    
    this.favorites.set([...favorites]);
    this.saveFavorites();
    return index === -1;
  }

  isFavorite(bookId: string): boolean {
    return this.favorites().includes(bookId);
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(this.favorites()));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  addRecentBook(book: RecentBook): void {
    let recent = this.recentBooks();
    
    recent = recent.filter(b => b.id !== book.id);
    
    recent.unshift(book);
    
    if (recent.length > 20) {
      recent = recent.slice(0, 20);
    }
    
    this.recentBooks.set(recent);
    this.saveRecentBooks();
  }

  private loadRecentBooks(): void {
    try {
      const data = localStorage.getItem(this.RECENT_KEY);
      const recent = data ? JSON.parse(data) : [];
      this.recentBooks.set(recent);
    } catch (error) {
      console.error('Error loading recent books:', error);
      this.recentBooks.set([]);
    }
  }

  private saveRecentBooks(): void {
    try {
      localStorage.setItem(this.RECENT_KEY, JSON.stringify(this.recentBooks()));
    } catch (error) {
      console.error('Error saving recent books:', error);
    }
  }

  setCache<T>(key: string, data: T): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.CACHE_KEY_PREFIX + key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  getCache<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY_PREFIX + key);
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      const age = Date.now() - cacheData.timestamp;
      
      if (age > this.CACHE_EXPIRY) {
        localStorage.removeItem(this.CACHE_KEY_PREFIX + key);
        return null;
      }
      
      return cacheData.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}
