#!/bin/sh

RELATIVE_DIR=`dirname "$0"`
cd $RELATIVE_DIR

# docker-compose down
# docker rm /redis

docker run \
--name icloud_guide_center_build \
--mount type=bind,source="$(pwd)",target=//srv/jekyll \
jekyll/jekyll:latest jekyll build

docker stop /icloud_guide_center_build
docker rm /icloud_guide_center_build
