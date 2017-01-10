#!/usr/bin/env bash

rm -rf dist

babel -d dist "./source/fp.js"

for i in $( find ./source/*.flow -type f ); do
  cp $i ./dist/$i
done
