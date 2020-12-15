#!/bin/sh

RELATIVE_DIR=`dirname "$0"`
cd $RELATIVE_DIR

docker-compose down
