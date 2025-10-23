import { Routes } from '@angular/router';
import { BooksComponent } from './pages/books/books.component';
import { AuthorsComponent } from './pages/authors/authors.component';
import { AuthorDetailComponent } from './pages/author-detail/author-detail.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';

export const routes: Routes = [
  { path: '', component: BooksComponent },
  { path: 'authors', component: AuthorsComponent },
  { path: 'author/:id', component: AuthorDetailComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: '**', redirectTo: '' }
];
