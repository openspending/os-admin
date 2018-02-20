FROM node:8-alpine

RUN apk add --update git

ADD . /app/
RUN cd /app && npm install && npm run build

EXPOSE 8000

COPY docker/startup.sh /startup.sh

CMD /startup.sh
