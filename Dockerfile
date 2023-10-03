# NodeJS 18 setup modified from standard NodeJS bullseye-slim installation
# borrow Dockerfile from https://github.com/consbio/mbgl-renderer/blob/main/docker/Dockerfile

FROM node:18 as build
ENV DEBIAN_FRONTEND noninteractive

# https://github.com/maplibre/maplibre-native/tree/main/platform/linux#prerequisites
RUN apt-get update
RUN apt-get install -y \
    build-essential \
    ccache \
    cmake \
    ninja-build \
    pkg-config \
    libcurl4-openssl-dev \
    libglfw3-dev \
    libuv1-dev \
    libjpeg62-turbo \
    libpng-dev \
    libwebp-dev \
    libicu-dev \
    libcairo2-dev \
    libgles2-mesa-dev \
    libgbm-dev  \
    xvfb \
    x11-utils

WORKDIR /app

RUN npm install -g npm
COPY package*.json /app/

RUN npm ci

COPY . /app/.

RUN ./scripts/build.sh

RUN cp entrypoint.sh ./build/.

FROM node:18-slim

RUN apt-get update && apt-get -y install xvfb x11-utils

WORKDIR /app
COPY --from=build /app/build /app

RUN npm i -g pm2

ENV DISPLAY=:99
EXPOSE 3000

ENTRYPOINT [ "/app/entrypoint.sh" ]
