FROM cypress/browsers:node14.15.0-chrome86-ff82

COPY package*json /app/

WORKDIR /app

RUN npm ci

RUN apt-get update && apt-get install -y wait-for-it

COPY . /app

CMD wait-for-it -t 30 --strict localhost:8080 -- npx cypress run
