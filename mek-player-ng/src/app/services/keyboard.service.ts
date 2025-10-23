import { Injectable } from '@angular/core';

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled = false;

  constructor() {
    this.setupGlobalListener();
  }

  private setupGlobalListener(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!this.enabled) return;

      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const shortcut = this.shortcuts.get(event.key.toLowerCase());
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    });
  }

  registerShortcut(key: string, description: string, action: () => void): void {
    this.shortcuts.set(key.toLowerCase(), { key, description, action });
  }

  unregisterShortcut(key: string): void {
    this.shortcuts.delete(key.toLowerCase());
  }

  clearShortcuts(): void {
    this.shortcuts.clear();
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }
}
