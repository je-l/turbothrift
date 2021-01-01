# Turbothrift

Turbothrift is a web service for monitoring new sale items for online
thrifting.

### Development

1. Copy .env.example to .env and setup required variables.

1. Run `docker-compose up`

The client and server are now running. Open client at http://localhost:8080

The Graphql playground is visible at http://localhost:4000/

### Email cronjob

The service runs periodic email cronjob which sends notifications for new list items.

Run unit tests for the web scraper.

`docker-compose -f docker-compose.scrape.yaml build && docker-compose -f docker-compose.scrape.yaml run --rm scrape npm test`

Run the web scraping job manually and send emails for new items:

`docker-compose -f docker-compose.scrape.yaml build && docker-compose -f docker-compose.scrape.yaml run --rm scrape`
