import re
import urllib.parse


def url_encode(string: str) -> str:
    res = urllib.parse.quote(string).replace('/', '_')
    res = res.replace('%', '_')
    return res


def clean_book_title(title: str) -> str:
    raw_title_cleaned = clean_string(title)
    title = raw_title_cleaned.replace('[Hangoskönyv]', '').strip()
    if title.endswith('MVGYOSZ hangoskönyvek'):
        title = title[:-len('MVGYOSZ hangoskönyvek')].strip()
    return title

def clean_chapter_title(title: str) -> str:
    raw_title_cleaned = clean_string(title)
    if '.mp3 - ' in raw_title_cleaned:
        title = raw_title_cleaned.split('.mp3 - ')[1]

        match = re.match(r'^\d+', raw_title_cleaned.split('.mp3 - ')[0])
        chapter_number = match.group(0) + ' - ' if match else ''
        if len(chapter_number) > 5:
            chapter_number = ''
        title = chapter_number + title
        return title
    return raw_title_cleaned


def clean_string(string: str) -> str:
    string = string.strip()
    res = string.replace('\n', ' ').replace('\u00A0', ' ').replace('\r', ' ').strip()
    return re.sub(r'\s+', ' ', res)
