FROM node:8-alpine

RUN apk add --update git 
RUN git clone http://github.com/openspending/os-admin.git app
RUN cd app && npm install
RUN cd app && npm run build

ENV OS_SNIPPETS_GA=UA-33874954-42

EXPOSE 8000

COPY docker/startup.sh /startup.sh

CMD /startup.sh
