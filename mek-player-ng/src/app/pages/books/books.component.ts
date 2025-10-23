import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';
import { BookListItem } from '../../models/book.model';

@Component({
  selector: 'app-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {
  books = signal<BookListItem[]>([]);
  filteredBooks = signal<BookListItem[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  itemsPerPage = 50;
  sortField = signal<'title' | 'author'>('title');
  sortDirection = signal<'asc' | 'desc'>('asc');
  filterMode = signal<'all' | 'favorites' | 'recent'>('all');
  viewMode = computed(() => this.storageService.settings().viewMode);

  recentBooks = computed(() => this.storageService.recentBooks());
  favoriteBooks = computed(() => {
    const favoriteIds = this.storageService.favorites();
    return this.books().filter(book => favoriteIds.includes(book.id));
  });
  
  currentlyPlayingBook = computed(() => {
    const state = this.storageService.getPlaybackState();
    if (!state) return null;
    
    const book = this.books().find(b => b.id === state.bookId);
    if (!book) return null;
    
    return {
      ...book,
      cover: book.cover ? `https://mek.oszk.hu${book.cover}` : '',
      chapterIndex: state.chapterIndex,
      currentTime: state.currentTime
    };
  });

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.dataService.getBookList().subscribe({
      next: (data) => {
        this.books.set(data);
        this.applyFilters();
      },
      error: (error) => console.error('Error loading books:', error)
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term.toLowerCase());
    this.currentPage.set(1);
    this.applyFilters();
  }

  onFilterChange(mode: 'all' | 'favorites' | 'recent'): void {
    this.filterMode.set(mode);
    this.currentPage.set(1);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered: BookListItem[] = [];

    if (this.filterMode() === 'recent') {
      const recentIds = this.recentBooks().map(rb => rb.id);
      filtered = this.books().filter(book => recentIds.includes(book.id));
    } else if (this.filterMode() === 'favorites') {
      filtered = this.favoriteBooks();
    } else {
      filtered = this.books();
    }

    if (this.searchTerm()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(this.searchTerm()) ||
        (book.author && book.author.toLowerCase().includes(this.searchTerm()))
      );
    }

    filtered.sort((a, b) => {
      const field = this.sortField();
      const direction = this.sortDirection() === 'asc' ? 1 : -1;
      const aVal = (field === 'title' ? a.title : a.author) || '';
      const bVal = (field === 'title' ? b.title : b.author) || '';
      return aVal.localeCompare(bVal, 'hu') * direction;
    });

    this.filteredBooks.set(filtered);
  }

  isFavorite(bookId: string): boolean {
    return this.storageService.isFavorite(bookId);
  }

  hasPlaybackState(bookId: string): boolean {
    return this.storageService.hasPlaybackState(bookId);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  onSort(field: 'title' | 'author'): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.applyFilters();
  }

  onBookClick(book: BookListItem): void {
    this.router.navigate(['/book', book.id]);
  }

  getPaginatedBooks(): BookListItem[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredBooks().slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredBooks().length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
    }
  }

  getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1);
    }
    if (current + delta < total - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }

    return range;
  }
  
  toggleViewMode(): void {
    const newMode = this.viewMode() === 'table' ? 'grid' : 'table';
    this.storageService.saveSettings({ viewMode: newMode });
  }
}
