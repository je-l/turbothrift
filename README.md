# Turbothrift

Turbothrift is a web service for monitoring new sale items.

### Development

1. Copy .env.example to .env and setup required variables.

1. Run `docker-compose up`

The client and server are now running. Open client at http://localhost:8080

### Email cronjob

Run unit tests for web scraping service and email jobs:

`docker-compose -f docker-compose.scrape.yaml build && docker-compose -f docker-compose.scrape.yaml run --rm scrape npm test`

Run the job manually:

`docker-compose -f docker-compose.scrape.yaml build && docker-compose -f docker-compose.scrape.yaml run --rm scrape`
