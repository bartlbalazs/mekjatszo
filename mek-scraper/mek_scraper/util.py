import re
import urllib.parse


def url_encode(string: str) -> str:
    res = urllib.parse.quote(string).replace('/', '_')
    res = res.replace('%', '_')
    return res


def clean_string(string: str) -> str:
    res = string.replace('\n', ' ').replace('\u00A0', ' ').replace('\r', ' ').strip()
    return re.sub(r'\s+', ' ', res)
