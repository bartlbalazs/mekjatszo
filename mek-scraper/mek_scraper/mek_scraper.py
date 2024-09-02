import logging
import sys

import click

from llm import LLM
from scraper import Scraper
from writer import Writer

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

MEK_URL = "https://mek.oszk.hu"


class ScraperCLI:
    @click.command()
    @click.option('--output-path', required=True, help='Path to save the scraped data')
    @click.option('--api-key', default='', help='API key LLM for authentication')
    def scrape(output_path, api_key):
        click.echo(f"Scraping book data and saving to {output_path}")
        scraper = Scraper(MEK_URL)
        books = scraper.scrape_book_list()
        click.echo(f"Scraped {len(books)} books")
        click.echo(f"Books: {books}")

        if api_key:
            click.echo(f"Adding similar books using LLM")
            llm = LLM(api_key)
            books = llm.add_similar(books)
            click.echo(f"Added similar books")
            click.echo(f"Books: {books}")

        click.echo(f"Saving data to {output_path}")
        writer = Writer()
        writer.write(books, output_path)


if __name__ == "__main__":
    cli = ScraperCLI()
    cli.scrape()
