FROM alpine:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install

#RUN apt-get update && apt-get upgrade -y && \
#    apt-get install -y nodejs \
#    npm

RUN apk add --update npm

RUN npm install --production --silent && mv node_modules ../

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]

#CMD npm start
