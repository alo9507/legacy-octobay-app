FROM node:12.22.1-alpine3.10

RUN apk --no-cache add git

# install simple http server for serving static content
RUN yarn global add http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN yarn install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

RUN mv .env.sample .env

# build app for production with minification
RUN npm run app:generate

EXPOSE 8080

CMD [ "http-server", "dist" ]