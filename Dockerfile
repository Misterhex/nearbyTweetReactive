FROM ubuntu:14.04

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y nodejs npm nodejs-legacy git ruby
RUN gem install sass

RUN npm install -g bower grunt-cli

## npm install
ADD package.json /src/package.json
RUN cd /src && npm install 

## bower install
ADD bower.json /src/bower.json
ADD .bowerrc /src/.bowerrc
RUN cd /src && bower install --allow-root 

ADD . /src

## grunt build
RUN cd /src && grunt build

EXPOSE 8080

CMD ["node", "/src/dist/server/app.js"]

