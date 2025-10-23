import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AudioService } from '../../services/audio.service';
import { StorageService } from '../../services/storage.service';
import { KeyboardService } from '../../services/keyboard.service';
import { Book, Chapter } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit, OnDestroy {
  book = signal<Book | null>(null);
  cover = signal('');
  loading = signal(true);
  showCoverModal = signal(false);
  isFavorite = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    public audioService: AudioService,
    public storageService: StorageService,
    private keyboardService: KeyboardService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadBook(id);
    });

    this.setupKeyboardShortcuts();
    this.keyboardService.enable();
  }

  ngOnDestroy(): void {
    this.keyboardService.clearShortcuts();
    this.keyboardService.disable();
  }

  private setupKeyboardShortcuts(): void {
    this.keyboardService.registerShortcut(' ', 'Play/Pause', () => {
      if (this.audioService.isPlaying()) {
        this.onPause();
      } else {
        this.onPlay();
      }
    });

    this.keyboardService.registerShortcut('arrowright', 'Forward 10s', () => {
      this.onForward();
    });

    this.keyboardService.registerShortcut('arrowleft', 'Rewind 10s', () => {
      this.onRewind();
    });

    this.keyboardService.registerShortcut('n', 'Next Chapter', () => {
      if (this.audioService.chapters().length > 1) {
        this.onNext();
      }
    });

    this.keyboardService.registerShortcut('p', 'Previous Chapter', () => {
      if (this.audioService.chapters().length > 1) {
        this.onPrev();
      }
    });

    this.keyboardService.registerShortcut('f', 'Toggle Favorite', () => {
      this.toggleFavorite();
    });
  }

  loadBook(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.isFavorite.set(this.storageService.isFavorite(id));

    this.dataService.getBook(id).subscribe({
      next: (data) => {
        this.book.set(data);
        if (data.cover) {
          this.cover.set(`https://mek.oszk.hu${data.cover}`);
        }

        const chapters: Chapter[] = data.audio_files.map(file => ({
          title: file.title,
          src: `https://mek.oszk.hu/${data.id.replace('_', '/')}/mp3/${file.url}`
        }));

        this.audioService.loadChapters(chapters, id);

        this.storageService.addRecentBook({
          id: data.id,
          title: data.title,
          author: data.author || 'Ismeretlen szerző',
          cover: data.cover,
          timestamp: Date.now()
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.error.set('Hiba történt a könyv betöltése közben. Kérlek próbáld újra később.');
        this.loading.set(false);
      }
    });
  }

  onPlay(): void {
    this.audioService.play();
  }

  onPause(): void {
    this.audioService.pause();
  }

  onNext(): void {
    this.audioService.next();
  }

  onPrev(): void {
    this.audioService.prev();
  }

  onForward(): void {
    this.audioService.forward();
  }

  onRewind(): void {
    this.audioService.rewind();
  }

  onSeek(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.audioService.seek(parseFloat(target.value));
  }

  onChapterClick(chapter: Chapter): void {
    this.audioService.play(chapter);
  }

  onSimilarBookClick(bookId: string): void {
    this.audioService.stop();
    this.router.navigate(['/book', bookId]);
  }
  
  onSpeedChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.audioService.setPlaybackSpeed(parseFloat(target.value));
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getBookPageUrl(): string {
    const isLocalhost = window.location.href.startsWith('http://localhost');
    return isLocalhost ? `/book/${this.book()?.id}` : `/mekjatszo/book/${this.book()?.id}`;
  }

  openCoverModal(): void {
    this.showCoverModal.set(true);
  }

  closeCoverModal(): void {
    this.showCoverModal.set(false);
  }

  toggleFavorite(): void {
    if (this.book()) {
      const isNowFavorite = this.storageService.toggleFavorite(this.book()!.id);
      this.isFavorite.set(isNowFavorite);
    }
  }

  retryLoad(): void {
    if (this.book()) {
      this.loadBook(this.book()!.id);
    }
  }
}
