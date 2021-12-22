FROM node:14.16.0-alpine3.13
RUN mkdir -p /app
WORKDIR /app
RUN mkdir data
COPY package*.json ./
RUN npm install
RUN npm install express --save
RUN npm install axios
COPY . . 
EXPOSE 8080
CMD ["npm", "start"]