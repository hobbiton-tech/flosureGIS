#stage 1
FROM node:12.18.2 as node
ARG MAX_OLD_SPACE_SIZE=4096
ARG NPM_TOKEN
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}
ENV CI=true
WORKDIR /app
COPY package.json ./
RUN npm i yarn
RUN yarn install --ignore-engines
RUN yarn global add @angular/cli@9.0.7
COPY . .
RUN ng build --prod --buildOptimizer=false --optimization=false --aot

EXPOSE 4400

#stage 2
FROM nginx:1.15.8-alpine
COPY --from=node /app/dist/flosure-broker-ui /usr/share/nginx/html
