import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';
import { AuthorListItem, BookListItem } from '../../models/book.model';

@Component({
  selector: 'app-authors',
  imports: [CommonModule, FormsModule],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss'
})
export class AuthorsComponent implements OnInit {
  authors = signal<AuthorListItem[]>([]);
  filteredAuthors = signal<AuthorListItem[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  itemsPerPage = 50;
  filterMode = signal<'all' | 'favorites'>('all');
  books = signal<BookListItem[]>([]);

  favoriteAuthors = computed(() => {
    const favoriteIds = this.storageService.favorites();
    const favoriteBooks = this.books().filter(book => favoriteIds.includes(book.id));
    const authorNames = new Set(favoriteBooks.map(book => book.author).filter(a => a));
    
    return this.authors().filter(author => authorNames.has(author.display_name));
  });

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
    this.loadBooks();
  }

  loadAuthors(): void {
    this.dataService.getAuthorList().subscribe({
      next: (data) => {
        this.authors.set(data.sort((a, b) => 
          a.display_name.localeCompare(b.display_name, 'hu')
        ));
        this.applyFilters();
      },
      error: (error) => console.error('Error loading authors:', error)
    });
  }

  loadBooks(): void {
    this.dataService.getBookList().subscribe({
      next: (data) => {
        this.books.set(data);
      },
      error: (error) => console.error('Error loading books:', error)
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term.toLowerCase());
    this.currentPage.set(1);
    this.applyFilters();
  }

  onFilterChange(mode: 'all' | 'favorites'): void {
    this.filterMode.set(mode);
    this.currentPage.set(1);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.filterMode() === 'favorites' 
      ? this.favoriteAuthors() 
      : this.authors();

    if (this.searchTerm()) {
      filtered = filtered.filter(author => 
        author.display_name.toLowerCase().includes(this.searchTerm())
      );
    }

    this.filteredAuthors.set(filtered);
  }

  hasFavoriteBooks(authorName: string): boolean {
    const favoriteIds = this.storageService.favorites();
    return this.books().some(book => 
      favoriteIds.includes(book.id) && book.author === authorName
    );
  }

  onAuthorClick(author: AuthorListItem): void {
    this.router.navigate(['/author', author.encoded]);
  }

  getPaginatedAuthors(): AuthorListItem[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredAuthors().slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredAuthors().length / this.itemsPerPage);
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
}
