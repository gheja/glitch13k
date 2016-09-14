#!/bin/bash

tmp=`realpath "$0"`
dir=`dirname "$tmp"`

cd "$dir/.."

build_number=`cat .build_number 2>/dev/null`
if [ "$build_number" == "" ]; then
	build_number=0
fi

build_number=$((build_number + 1))
echo "$build_number" > .build_number

base64_data=`cat ./src/sprites.png | base64 -w 0`

now=`date +%Y%m%d_%H%M%S`
build_id="${now}_build_${build_number}"

mkdir -p ./dist
rsync -xa --delete-during ./src/ ./dist/

rm dist/resources.js dist/editor.html

cat ./src/resources.js | sed -r "s!SPRITESHEET_URL = \"[^\"]+\"!SPRITESHEET_URL = \"data:image/png;base64,${base64_data}\"!g" > dist/resources.js
cat ./src/editor.html | sed -r "s,<!-- build id -->,${build_id},g" > dist/editor.html

chmod -R ugo+rx ./dist

tar -c --one-file-system --numeric-owner ./src | gzip -c9 > ./backups/${build_id}.tar.gz
