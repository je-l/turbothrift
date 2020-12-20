FROM node:14

COPY package.json /app/package.json

RUN npm i

COPY . /app

WORKDIR /app

CMD ["npm", "start"]
