FROM node:14

COPY package.json /app/package.json

WORKDIR /app

RUN npm i

COPY . /app

ENV PATH $PATH:./node_modules/.bin

CMD ["npm", "start"]
