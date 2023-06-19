FROM node:19-alpine

COPY package.json /app/
COPY tsconfig.json /app/
COPY .env /app/
COPY nodemon.json /app/
COPY src /app
COPY jest.config.ts /app/

WORKDIR /app

RUN npm install

CMD [ "node","server.ts" ]