#!/usr/bin/env bash
image_version=`date +%Y%m%d%H%M`;
# 关闭carp-ui容器
docker stop carp-ui || true;
# 删除carp-ui容器
docker rm carp-ui || true;
# 删除carp-ui镜像
docker rmi --force $(docker images | grep carp-ui | awk '{print $3}')
# 构建carp-ui:$image_version镜像
docker build . -t carp-ui:$image_version;
# 查看镜像列表
docker images;
# 基于carp-ui 镜像 构建一个容器 carp-ui
docker run\
    -p 8000:80 -d\
    --name carp-ui\
    --add-host carp-gateway:192.168.0.116\
    carp-ui:$image_version ;
# 查看日志
docker logs carp-ui;
#删除build过程中产生的镜像    #docker image prune -a -f
docker rmi $(docker images -f "dangling=true" -q)
# 对空间进行自动清理
docker system prune -a -f
