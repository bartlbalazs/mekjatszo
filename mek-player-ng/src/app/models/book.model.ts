export interface AudioFile {
  url: string;
  title: string;
}

export interface SimilarBook {
  id: string;
  author?: string;
  title: string;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  lead: string;
  cover?: string;
  description?: string;
  audio_files: AudioFile[];
  url: string;
  similar_books?: SimilarBook[];
}

export interface BookListItem {
  id: string;
  title: string;
  author: string;
  lead: string;
  cover: string;
}

export interface AuthorListItem {
  display_name: string;
  encoded: string;
}

export interface Chapter {
  title: string;
  src: string;
  isPlaying?: boolean;
  percent?: number;
  currentlyTimer?: string;
  totalTimer?: string;
  duration?: number;
}
