import re
import urllib.parse


def url_encode(string: str) -> str:
    return urllib.parse.quote(string).replace('/', '_')


def clean_string(string: str) -> str:
    res = string.replace('\n', ' ').replace('\u00A0', ' ').replace('\r', ' ').strip()
    return re.sub(r'\s+', ' ', res)
