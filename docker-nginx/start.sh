#!/bin/bash

docker run --rm -d -p 80:80 -v $PWD/nginx.conf:/etc/nginx/nginx.conf nginx