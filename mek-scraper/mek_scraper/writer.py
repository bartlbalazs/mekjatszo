import json
import logging
import os

import util

FULL_JSON = 'full.json'
AUTHOR_LIST_JSON = 'author_list.json'


class Writer:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def write(self, books: list, output_path: str) -> None:
        self.write_full_data_to_file(books, output_path)
        self.write_book_data_to_files(books, output_path)
        self.write_grouped_by_author_to_files(books, output_path)

    def write_full_data_to_file(self, books, output_path):
        file_path = os.path.join(output_path, FULL_JSON)
        self.logger.info(f"Starting to write full to {file_path}")
        self._write_books_to_file(books, file_path)

    def write_book_data_to_files(self, books, output_path):
        os.makedirs(os.path.join(output_path, 'books'), exist_ok=True)
        for book in books:
            file_path = os.path.join(output_path, 'books', f"{book.id}.json")
            self.logger.info(f"Starting to write book to {file_path}")
            try:
                with open(file_path, 'w', encoding='utf-8') as file:
                    json.dump(book.dict(), file, indent=2, ensure_ascii=False)
                self.logger.info(f"Successfully wrote data to {file_path}")
            except Exception as e:
                self.logger.error(f"Failed to write data to {file_path}: {e}")

    def write_grouped_by_author_to_files(self, books, output_path):

        def _group_books_by_author(books):
            grouped_dict = {}
            for b in books:
                key = b.author
                if key is None or key == '':
                    continue
                if key not in grouped_dict:
                    grouped_dict[key] = []
                grouped_dict[key].append(b)
            return grouped_dict

        grouped_books = _group_books_by_author(books)
        os.makedirs(os.path.join(output_path, 'authors'), exist_ok=True)
        for author, books in grouped_books.items():
            file_path = os.path.join(output_path, 'authors', f"{util.url_encode(author)}.json")
            self.logger.info(f"Starting to write data to {file_path}")
            self._write_books_to_file(books, file_path)

        self._write_authors_to_file(grouped_books.keys(), output_path)

    def _write_books_to_file(self, books, file_path):
        books_dict = [book.dict() for book in books]
        try:
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump(books_dict, file, indent=2, ensure_ascii=False)
            self.logger.info(f"Successfully wrote data to {file_path}")
        except Exception as e:
            self.logger.error(f"Failed to write data to {file_path}: {e}")

    def _write_authors_to_file(self, authors, output_path):
        authors_list = [{'encoded': util.url_encode(author), 'display_name': author} for author in authors]
        file_path = os.path.join(output_path, AUTHOR_LIST_JSON)
        try:
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump(authors_list, file, indent=2, ensure_ascii=False)
            self.logger.info(f"Successfully wrote data to {file_path}")
        except Exception as e:
            self.logger.error(f"Failed to write data to {file_path}: {e}")
