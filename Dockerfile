FROM node:14

WORKDIR /CrudApp01

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

ENV PORT=3000

EXPOSE 3000

#tells the container how to run the command
CMD ["npm", "run", "devstart"]