FROM node:11

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4 git

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
RUN apt-get update && apt-get install -y wget --no-install-recommends
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> \
  /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-unstable \
  fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends
RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /src/*.deb

RUN npm i -g npm
RUN npm -g config set user root
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV ROUTINE_DESIGN_DOCKER true
RUN npm i -g routine-design

RUN mkdir -p /home/routine-design
WORKDIR /home/routine-design/
