import logging
import sys

import click

from scraper import Scraper
from writer import Writer

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

MEK_URL = "https://mek.oszk.hu"


class ScraperCLI:
    @click.command()
    @click.option('--output-path', required=True, help='Path to save the scraped data')
    def scrape(output_path):
        click.echo(f"Scraping book data and saving to {output_path}")
        scraper = Scraper(MEK_URL)
        books = scraper.scrape_book_list()
        click.echo(f"Scraped {len(books)} books")
        click.echo(f"Books: {books}")
        click.echo(f"Saving data to {output_path}")
        writer = Writer()
        writer.write(books, output_path)


if __name__ == "__main__":
    cli = ScraperCLI()
    cli.scrape()
