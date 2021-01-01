FROM node:14

COPY package.json /scrape/package.json

WORKDIR /scrape

RUN npm i

COPY . /scrape

CMD ["npx", "ts-node", "scrape.ts"]
