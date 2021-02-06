FROM cypress/base:14.15.4

COPY package*json /app/

WORKDIR /app

RUN npm ci && npm cache clear --force

RUN apt-get update && apt-get install -y wait-for-it && apt-get clean

COPY . /app

CMD wait-for-it -t 30 --strict localhost:8080 -- npx cypress run
