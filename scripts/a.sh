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

base64_data=`php ./scripts/base64.php ./src/sprites.png | sed -e 's,\/,\\\\/,g' | sed -e 's,\+,\\\\+,g'`

now=`date +%Y%m%d_%H%M%S`
build_id="${now}_build_${build_number}"

tmp=`cat ./src/editor.html | grep -Eo '<script type="text/javascript" src="[^"]+"></script>' | cut -d \" -f 4`
# scripts="_header.js $tmp _footer.js"
scripts="$tmp"

{
for i in $scripts; do
	echo ""
	echo ""
	echo ""
	echo "/* *** $i **************************************** */"
	echo ""
	cat "./src/$i"
done
} > ./tmp/scripts.js
cp ./src/editor.html ./tmp/editor.html

cat ./tmp/scripts.js | sed -r "s/SPRITESHEET_URL = \"[^\"]+\"/SPRITESHEET_URL = \"${base64_data}\"/g" > ./tmp/scripts2.js

# TODO
cp ./tmp/scripts2.js ./tmp/scripts.min.js


cat ./tmp/editor.html | \
	sed -E 's,<script[^>]+></script>,,gi' | \
	sed -r "s,<!-- build id -->,${build_id},g" | \
	sed -e '/<!-- insert minified javascript here -->/{' \
		-e 'i <script>' \
		-e 'r ./tmp/scripts.min.js' \
		-e 'a </script>' \
		-e 'd}' \
		-e '/<!-- insert minified css here -->/{' \
		-e 'i <style>' \
		-e 'r ./build/stage2/style2.css' \
		-e 'a </style>' \
		-e 'd}' \
	> ./tmp/editor2.html

# cat ./tmp/editor2.html | grep -Ev '^\s+$' | sed -r 's/^\s+//g' | tr -d '\r' | tr '\n' ' ' | sed -e 's/> </></g' > ./tmp/editor3.html

# mkdir -p ./dist
# rm ./dist/*
# cp ./tmp/editor3.html ./dist/editor.html

# chmod -R ugo+rx ./dist

# tar -c --one-file-system --numeric-owner ./src | gzip -c9 > ./backups/${build_id}.tar.gz
