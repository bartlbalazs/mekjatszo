import logging
from typing import List

import requests
from bs4 import BeautifulSoup

import util
from model import AudioFile, Book

FIRST_PAGE = '/keresesek/keresesf.phtml?formatum=MP3'

MEK_CHARSET = 'iso-8859-2'


class Scraper:

    def __init__(self, url):
        self.url = url

    def _get_request(self, url: str, charset: str = MEK_CHARSET) -> str:
        response = requests.get(url)
        response.raise_for_status()
        response.encoding = charset
        return response.text

    def _get_next_page(self, soup: BeautifulSoup) -> BeautifulSoup:
        pager = soup.select_one('body > center > table:nth-child(4) > tr > td.lapoz')
        if not pager:
            return None
        actuallap = pager.find_next(attrs={'class': 'actuallap'})
        next_link = actuallap.parent.parent.next_sibling
        if not next_link:
            return None
        return BeautifulSoup(self._get_request(self.url + next_link.attrs['href']), 'html.parser')

    def _get_books(self, soup: BeautifulSoup) -> List[Book]:
        book_urls = list(
            map(lambda e: e.attrs['href'], filter(lambda e: e.attrs['href'].startswith(self.url), soup.find_all('a'))))
        return [self._get_book(url) for url in book_urls]

    def _get_book(self, url: str) -> Book:
        id = util.url_encode(url[len('https://mek.oszk.hu/'):])
        page = BeautifulSoup(self._get_request(url, 'utf-8'), 'html.parser')
        raw_title = page.select_one('#pagetop > section > div.DC.CSS-item > div.content > h3').text
        title = util.clean_book_title(raw_title)
        lead = util.clean_string(
            page.select_one('#pagetop > section > div.DC.CSS-item > div.content > div.itemlead').text)
        author = None
        try:
            author = util.clean_string(page.select_one("#pagetop > section > div.DC.CSS-item > div.content > h4").text)
        except AttributeError:
            pass
        if author == '\xa0':
            author = None
        cover = None
        try:
            cover = page.select_one('#pagetop > section > div.DC.CSS-item > div.content > div.ipic > img').attrs['src']
        except AttributeError:
            pass

        description = None
        try:
            description_page = BeautifulSoup(self._get_request(url + '/fulszoveg.html', 'utf-8'), 'html.parser')
            description = description_page.select_one('ismerteto').get_text(separator=' ', strip=True)
            description = util.clean_string(description)
            if description.startswith('Fülszöveg '):
                description = description[len('Fülszöveg '):].strip()
        except AttributeError:
            pass

        audio_files_page = BeautifulSoup(self._get_request(url + '/mp3/index.html', 'utf-8'), 'html.parser')
        audio_files = list(
            map(lambda a: AudioFile(url=a.attrs['href'], title=util.clean_chapter_title(a.text)),
                filter(lambda t: t.attrs['href'].endswith('.mp3'), audio_files_page.find_all('a'))))
        return Book(id=id, title=title, author=author, lead=lead, cover=cover, url=url, description=description,
                    audio_files=audio_files)


    def scrape_book_list(self) -> List[Book]:
        books = []
        page = BeautifulSoup(self._get_request(self.url + FIRST_PAGE), 'html.parser')
        while page:
            books.extend(self._get_books(page))
            logging.info(f"Scraping page {self.url}")
            page = self._get_next_page(soup=page)
        return books
