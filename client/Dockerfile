FROM node:14-buster-slim

COPY package.json /app/package.json

WORKDIR /app

RUN npm i

COPY . /app

CMD ["npm", "start"]
