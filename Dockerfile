#stage 1
FROM jng5/jessie-yarn-secure
MAINTAINER Julie Ng <hello@julie.io>

RUN yarn global add angular-cli
COPY . .
RUN ng build --prod --aot



#stage 2
FROM nginx:1.15.8-alpine
COPY --from=node /app/dist/flosure-broker-ui /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/nginx.conf
