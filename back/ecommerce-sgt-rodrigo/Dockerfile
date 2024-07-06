FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install || npm install || npm install

COPY . . 
#Added
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]