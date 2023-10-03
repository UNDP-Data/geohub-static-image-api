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
    x11-utils \
    wget

RUN ARCH= && dpkgArch="$(dpkg --print-architecture)" \
  && case "${dpkgArch##*-}" in \
  amd64) ARCH='x64';; \
  arm64) ARCH='arm64';; \
  *) echo "unsupported architecture"; exit 1 ;; \
  esac
RUN dpkgArch="$(dpkg --print-architecture)"
RUN wget --no-verbose http://snapshot.debian.org/archive/debian/20190501T215844Z/pool/main/g/glibc/multiarch-support_2.28-10_$dpkgArch.debian
RUN apt install ./multiarch-support_2.28-10_$dpkgArch.deb 
RUN wget --no-verbose http://snapshot.debian.org/archive/debian/20141009T042436Z/pool/main/libj/libjpeg8/libjpeg8_8d1-2_$dpkgArch.deb
RUN apt install ./libjpeg8_8d1-2_$dpkgArch.deb
RUN wget --no-verbose http://archive.ubuntu.com/ubuntu/pool/main/i/icu/libicu66_66.1-2ubuntu2.1_amd64.deb
RUN apt install ./libicu66_66.1-2ubuntu2.1_amd64.deb && \
RUN rm -rf *.deb

WORKDIR /app

RUN npm install -g npm
COPY package*.json /app/

RUN npm ci

COPY . /app/.

RUN npm run build
RUN rm -rf node_modules
RUN npm install --omit=dev
RUN cp package.json build/.
RUN mv node_modules build/.

RUN cp entrypoint.sh ./build/.

FROM node:18-slim

RUN apt-get update && apt-get -y install xvfb x11-utils

WORKDIR /app
COPY --from=build /app/build /app

RUN npm i -g pm2

ENV DISPLAY=:99
EXPOSE 3000

ENTRYPOINT [ "/app/entrypoint.sh" ]
