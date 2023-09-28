# NodeJS 18 setup modified from standard NodeJS bullseye-slim installation
# borrow Dockerfile from https://github.com/consbio/mbgl-renderer/blob/main/docker/Dockerfile

FROM node:18 as build
ENV DEBIAN_FRONTEND noninteractive

RUN apt update

# https://github.com/maplibre/maplibre-native/tree/main/platform/linux#prerequisites
RUN apt install -y g++ git cmake ccache ninja-build pkg-config
RUN apt install -y libcurl4-openssl-dev libglfw3-dev libuv1-dev libpng-dev libicu-dev libjpeg-dev libjpeg62-turbo libwebp-dev

WORKDIR /app
RUN npm install -g npm
COPY package*.json /app/

RUN npm ci

COPY . .

RUN npm run build
RUN rm -rf node_modules
RUN npm ci --only=production
RUN cp package.json build/.
RUN mv node_modules build/.

# production image
FROM keymetrics/pm2:18-slim

WORKDIR /geohub
# copy build folder from build image
COPY --from=build /app/build /geohub

EXPOSE 3000

# rum pm2 cluster with maximum 4 instances
# https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/#pm2-runtime-helper
CMD ["pm2-runtime", "index.js", "-i", "4"]