FROM node:11

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm install pm2 -g

CMD ["pm2-runtime", "ecosystem.config.js"]
