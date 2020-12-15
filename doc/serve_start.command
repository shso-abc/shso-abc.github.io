#!/bin/sh

# 파일 생성시 실행파일에 실행권한 주기
# chmod 755 file_name.command
# ex) chmod 755 build_start.command

echo 'PARAM:' $0
RELATIVE_DIR=`dirname "$0"`
echo 'Dir:' $RELATIVE_DIR

cd $RELATIVE_DIR
SHELL_PATH=`pwd -P`
echo $SHELL_PATH

docker-compose up

# Dockerfile 사용시 
# docker run --name guideCenter --volume="$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll jekyll serve
# docker run --volume="$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll bundle exec jekyll serve

# docker-compose 사용시 
# docker-compose restart
# docker-compose up
# docker-compose down

