FROM node:14

COPY package.json /app/package.json

WORKDIR /app

RUN npm i

COPY . /app

CMD ["npm", "start"]
