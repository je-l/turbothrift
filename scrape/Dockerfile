FROM node:14-buster-slim

RUN apt-get update && apt-get install -y wait-for-it

COPY package.json /scrape/package.json

WORKDIR /scrape

RUN npm i

COPY . /scrape

CMD ["npx", "ts-node", "scrape.ts"]
