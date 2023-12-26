FROM node:alpine 
COPY . /app

WORKDIR /app/src

RUN npm install

EXPOSE 5000

CMD node server.js