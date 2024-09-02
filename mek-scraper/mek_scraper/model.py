from typing import Optional, List

from pydantic import BaseModel


class AudioFile(BaseModel):
    url: str
    title: str

class SimilarBook(BaseModel):
    id: str
    author: Optional[str] = None
    title: str

class Book(BaseModel):
    id: str
    title: str
    author: Optional[str] = None
    lead: str
    cover: Optional[str] = None
    description: Optional[str] = None
    audio_files: List[AudioFile]
    url: str
    similar_books: Optional[List[SimilarBook]] = []
