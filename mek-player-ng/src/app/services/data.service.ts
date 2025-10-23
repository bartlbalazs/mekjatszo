import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Book, BookListItem, AuthorListItem } from '../models/book.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.baseUrl = window.location.href.startsWith('http://localhost') 
      ? 'http://localhost:4200' 
      : 'https://bartlbalazs.github.io/mekjatszo/';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ismeretlen hiba történt';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Hálózati hiba: ${error.error.message}`;
    } else {
      errorMessage = `Szerver hiba: ${error.status} - ${error.message}`;
    }
    
    console.error('Data service error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  getBookList(): Observable<BookListItem[]> {
    const cacheKey = 'book_list';
    const cached = this.storageService.getCache<BookListItem[]>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<BookListItem[]>(`${this.baseUrl}/static/full_list.json`).pipe(
      tap(data => this.storageService.setCache(cacheKey, data)),
      catchError(this.handleError)
    );
  }

  getAuthorList(): Observable<AuthorListItem[]> {
    const cacheKey = 'author_list';
    const cached = this.storageService.getCache<AuthorListItem[]>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<AuthorListItem[]>(`${this.baseUrl}/static/author_list.json`).pipe(
      tap(data => this.storageService.setCache(cacheKey, data)),
      catchError(this.handleError)
    );
  }

  getBook(id: string): Observable<Book> {
    const cacheKey = `book_${id}`;
    const cached = this.storageService.getCache<Book>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<Book>(`${this.baseUrl}/static/books/${id}.json`).pipe(
      tap(data => this.storageService.setCache(cacheKey, data)),
      catchError(this.handleError)
    );
  }

  getAuthorBooks(encodedName: string): Observable<Book[]> {
    const cacheKey = `author_books_${encodedName}`;
    const cached = this.storageService.getCache<Book[]>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<Book[]>(`${this.baseUrl}/static/authors/${encodedName}.json`).pipe(
      tap(data => this.storageService.setCache(cacheKey, data)),
      catchError(this.handleError)
    );
  }
}
