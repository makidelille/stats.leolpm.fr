FROM node:carbon

WORKDIR /usr/src/app
RUN mkdir data

COPY package.json .
RUN npm install --production

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]