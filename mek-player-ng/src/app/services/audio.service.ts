import { Injectable, signal, inject } from '@angular/core';
import { Chapter } from '../models/book.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private storageService = inject(StorageService);
  
  isPlaying = signal(false);
  currentTime = signal('00:00');
  totalTime = signal('00:00');
  progress = signal(0);
  currentChapter = signal<Chapter | null>(null);
  chapters = signal<Chapter[]>([]);
  currentIndex = signal(0);
  currentBookId = signal<string | null>(null);
  playbackSpeed = signal(1);

  constructor() {
    this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
    
    const settings = this.storageService.settings();
    this.setPlaybackSpeed(settings.playbackSpeed);
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed.set(speed);
    this.audio.playbackRate = speed;
    this.storageService.saveSettings({ playbackSpeed: speed });
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private onTimeUpdate(): void {
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;
    
    this.currentTime.set(this.formatTime(currentTime));
    if (duration && !isNaN(duration)) {
      this.progress.set((currentTime * 100) / duration);
    }

    const bookId = this.currentBookId();
    if (bookId && currentTime > 0) {
      this.storageService.savePlaybackState({
        bookId,
        chapterIndex: this.currentIndex(),
        currentTime,
        timestamp: Date.now(),
        totalChapters: this.chapters().length,
        chapterDuration: duration
      });
    }
  }

  private onEnded(): void {
    const bookId = this.currentBookId();
    if (bookId) {
      this.storageService.markChapterCompleted(bookId, this.currentIndex());
    }
    this.next();
  }

  private onLoadedMetadata(): void {
    const duration = this.audio.duration;
    this.totalTime.set(this.formatTime(duration));
  }

  loadChapters(chapters: Chapter[], bookId: string): void {
    this.pause();
    this.audio.src = '';
    this.audio.currentTime = 0;
    this.currentTime.set('00:00');
    this.totalTime.set('00:00');
    this.progress.set(0);
    this.chapters.set(chapters);
    this.currentBookId.set(bookId);
    
    this.storageService.setCurrentBook(bookId);

    if (chapters.length > 0) {
      const savedState = this.storageService.getPlaybackState(bookId);
      const chapterIndex = savedState ? savedState.chapterIndex : 0;
      const startTime = savedState ? savedState.currentTime : 0;

      if (chapterIndex < chapters.length) {
        this.currentChapter.set(chapters[chapterIndex]);
        this.currentIndex.set(chapterIndex);
        this.audio.src = chapters[chapterIndex].src;
        
        if (startTime > 0) {
          this.audio.addEventListener('loadedmetadata', () => {
            this.audio.currentTime = startTime;
          }, { once: true });
        }
      } else {
        this.currentChapter.set(chapters[0]);
        this.currentIndex.set(0);
        this.audio.src = chapters[0].src;
      }
    }
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  play(chapter?: Chapter): void {
    if (chapter) {
      const index = this.chapters().indexOf(chapter);
      this.currentIndex.set(index);
      this.currentChapter.set(chapter);
      this.audio.src = chapter.src;
      this.audio.playbackRate = this.playbackSpeed();
    } else if (!this.audio.src && this.currentChapter()) {
      this.audio.src = this.currentChapter()!.src;
      this.audio.playbackRate = this.playbackSpeed();
    }

    this.audio.play();
    this.isPlaying.set(true);
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying.set(false);
  }

  next(): void {
    const bookId = this.currentBookId();
    if (bookId) {
      this.storageService.markChapterCompleted(bookId, this.currentIndex());
    }
    
    const chapters = this.chapters();
    let index = this.currentIndex() + 1;
    if (index >= chapters.length) {
      index = 0;
    }
    this.currentIndex.set(index);
    this.currentChapter.set(chapters[index]);
    this.play(chapters[index]);
  }

  prev(): void {
    const chapters = this.chapters();
    let index = this.currentIndex() - 1;
    if (index < 0) {
      index = chapters.length - 1;
    }
    this.currentIndex.set(index);
    this.currentChapter.set(chapters[index]);
    this.play(chapters[index]);
  }
  
  isChapterCompleted(chapterIndex: number): boolean {
    const bookId = this.currentBookId();
    return bookId ? this.storageService.isChapterCompleted(bookId, chapterIndex) : false;
  }

  forward(): void {
    this.audio.currentTime += 10;
  }

  rewind(): void {
    this.audio.currentTime -= 10;
  }

  seek(percent: number): void {
    if (this.audio.duration) {
      this.audio.currentTime = (percent * this.audio.duration) / 100;
    }
  }

  stop(): void {
    this.pause();
    this.audio.currentTime = 0;
  }
}
