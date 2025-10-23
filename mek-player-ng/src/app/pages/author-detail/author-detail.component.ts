import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-author-detail',
  imports: [CommonModule],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.scss'
})
export class AuthorDetailComponent implements OnInit {
  books = signal<Book[]>([]);
  authorName = signal('');
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const encodedName = params['id'];
      this.loadAuthorBooks(encodedName);
    });
  }

  loadAuthorBooks(encodedName: string): void {
    this.loading.set(true);
    this.dataService.getAuthorBooks(encodedName).subscribe({
      next: (data) => {
        this.books.set(data.map(book => ({
          ...book,
          cover: book.cover ? `https://mek.oszk.hu${book.cover}` : undefined
        })));
        if (data.length > 0 && data[0].author) {
          this.authorName.set(data[0].author);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading author books:', error);
        this.loading.set(false);
      }
    });
  }

  onBookClick(book: Book): void {
    this.router.navigate(['/book', book.id]);
  }

  goBack(): void {
    this.router.navigate(['/authors']);
  }
}
