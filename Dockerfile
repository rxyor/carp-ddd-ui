FROM nginx:latest
MAINTAINER ly <liuyangrxy@163.com>
COPY dist/ /usr/share/nginx/html
VOLUME /tmp
EXPOSE 80

