import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { StorageService } from '../../services/storage.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-mini-player',
  imports: [CommonModule],
  templateUrl: './mini-player.html',
  styleUrl: './mini-player.scss',
})
export class MiniPlayer implements OnInit {
  private audioService = inject(AudioService);
  private storageService = inject(StorageService);
  private dataService = inject(DataService);
  private router = inject(Router);
  
  currentBookTitle = signal<string>('');
  currentBookAuthor = signal<string>('');
  currentBookCover = signal<string>('');
  
  isVisible = computed(() => {
    return this.audioService.currentBookId() !== null;
  });
  
  ngOnInit(): void {
    const currentBookId = this.audioService.currentBookId();
    if (currentBookId) {
      this.loadBookInfo(currentBookId);
    }
  }
  
  private loadBookInfo(bookId: string): void {
    const recentBooks = this.storageService.recentBooks();
    const recentBook = recentBooks.find(b => b.id === bookId);
    
    if (recentBook) {
      this.currentBookTitle.set(recentBook.title);
      this.currentBookAuthor.set(recentBook.author);
      this.currentBookCover.set(recentBook.cover ? `https://mek.oszk.hu${recentBook.cover}` : '');
    } else {
      this.dataService.getBook(bookId).subscribe({
        next: (book) => {
          this.currentBookTitle.set(book.title);
          this.currentBookAuthor.set(book.author || 'Ismeretlen szerző');
          this.currentBookCover.set(book.cover ? `https://mek.oszk.hu${book.cover}` : '');
        },
        error: () => {
          this.currentBookTitle.set('');
          this.currentBookAuthor.set('');
        }
      });
    }
  }
  
  get audioServiceRef() {
    return this.audioService;
  }
  
  togglePlayPause(): void {
    if (this.audioService.isPlaying()) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }
  
  skipPrev(): void {
    this.audioService.prev();
  }
  
  skipNext(): void {
    this.audioService.next();
  }
  
  openBook(): void {
    const bookId = this.audioService.currentBookId();
    if (bookId) {
      this.router.navigate(['/book', bookId]);
    }
  }
}
