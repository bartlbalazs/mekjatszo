from uuid import uuid4

from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance

from model import Book, SimilarBook

BOOKS_COLLECTION_NAME = "books"


class LLM:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def add_similar(self, books: list[Book]) -> list[Book]:
        qdrant_client = QdrantClient(":memory:")
        qdrant_client.create_collection(
            collection_name=BOOKS_COLLECTION_NAME,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE),
        )

        def _get_content(book: Book) -> str:
            result = book.author + ' ' if book.author else ''
            result += book.title + ' '
            if book.lead:
                result += book.lead
            if book.description:
                result += (' ' + book.description)
            return result

        book_documents = [Document(metadata={"id": book.id, "title": book.title, "author": book.author},
                                   page_content=_get_content(book)) for book in books]
        uuids = [str(uuid4()) for _ in range(len(book_documents))]

        vector_store = QdrantVectorStore(
            client=qdrant_client,
            collection_name=BOOKS_COLLECTION_NAME,
            embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=self.api_key),
        )
        vector_store.add_documents(documents=book_documents, ids=uuids)

        for ind in range(len(books)):
            similar_books = qdrant_client.query_points(collection_name=BOOKS_COLLECTION_NAME,
                                                       query=uuids[ind],
                                                       with_vectors=False,
                                                       limit=5).points

            similar_books = [SimilarBook(id=book.payload['metadata']['id'], author=book.payload['metadata']['author'],
                                         title=book.payload['metadata']['title']) for book in similar_books]
            books[ind].similar_books = similar_books

        return books
