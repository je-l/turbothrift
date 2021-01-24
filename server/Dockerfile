FROM node:14-buster-slim

RUN apt-get update && apt-get install -y wait-for-it

COPY package.json /app/package.json

WORKDIR /app

RUN npm i

COPY . /app

ENV PATH $PATH:./node_modules/.bin

CMD ["npm", "start"]
