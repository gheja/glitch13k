#!/bin/bash

export LANG="en_US.UTF-8"

name="glitch13k"
now=`date +%Y%m%d_%H%M%S`

if [ $TERM == "xterm" ] || [ $TERM == "screen" ]; then
	color_error='\033[1;31m'
	color_message='\033[1;38m'
	color_default='\033[0m'
else
	color_error=''
	color_message=''
	color_default=''
fi

_message()
{
	# echo ""
	if [ $TERM == "xterm" ]; then
		echo -ne "${color_message}"
		echo "$@"
		echo -ne "${color_default}"
	else
		echo "$@"
	fi
}

_header()
{
	echo ""
	_message "$@"
}

_error()
{
	# echo ""
	if [ $TERM == "xterm" ]; then
		echo -ne "${color_error}"
		echo "$@"
		echo -ne "${color_default}"
	else
		echo "$@"
	fi
}

try()
{
	$@
	
	result=$?
	if [ $result != 0 ]; then
		_error "ERROR: \"$@\" failed with exit code $result."
		exit 1
	fi
}

is_js13k="n"
stage1_enabled="y"
stage2_enabled="y"
stage3_enabled="y"
stage4_enabled="n"
advzip_test_enabled="n"

prepare()
{
	[ -d ./build ] || try mkdir -vp ./build
	[ -d ./build/compiler ] || try mkdir -vp ./build/compiler
	[ -d ./build/advancecomp ] || try mkdir -vp ./build/advancecomp
	
	_message "Checking dependencies..."
	which java 2>/dev/null >/dev/null
	if [ $? != 0 ]; then
		_error "ERROR: \"java\" not found in PATH, probably is not installed."
		exit 1
	fi
	_message "  * Java: OK"
	
	which zip 2>/dev/null >/dev/null
	if [ $? != 0 ]; then
		_error "ERROR: \"zip\" not found in PATH, probably is not installed."
		exit 1
	fi
	_message "  * ZIP: OK"
	
	which base64 2>/dev/null >/dev/null
	if [ $? != 0 ]; then
		_error "ERROR: \"base64\" not found in PATH, probably is not installed."
		exit 1
	fi
	_message "  * base64: OK"
	
	if [ ! -e ./build/compiler/compiler.jar ]; then
		_message "  * Closure compiler: not found"
		
		try cd ./build/compiler
		
		if [ ! -e compiler-latest.zip ]; then
			_message "    * Downloading..."
			try wget http://dl.google.com/closure-compiler/compiler-latest.zip
		fi
		
		_message "    * Unzipping... "
		try unzip compiler-latest.zip
		
		if [ ! -e ./compiler.jar ]; then
			jar=`ls -1 *.jar | tail -n 1`
			ln -s $jar compiler.jar
		fi
		
		try cd ../..
		
		if [ ! -e ./build/compiler/compiler.jar ]; then
			_error "Failed."
		fi
	fi
	_message "  * Closure compiler: OK"
	
	if [ ! -e ./build/advancecomp/advancecomp-1.20/advzip ]; then
		_message "  * AdvZIP: not found"
		
		try cd ./build/advancecomp
		
		if [ ! -e advancecomp-1.20.tar.gz ]; then
			_message "    * Downloading..."
			try wget https://github.com/amadvance/advancecomp/releases/download/v1.20/advancecomp-1.20.tar.gz
		fi
		
		_message "    * Unzipping... "
		try tar -xzf advancecomp-1.20.tar.gz
		
		cd ./advancecomp-1.20
		
		_message "    * Configuring... "
		./configure
		
		_message "    * Compiling... "
		make
		
		try cd ../../..
		
		if [ ! -e ./build/advancecomp/advancecomp-1.20/advzip ]; then
			_error "Failed."
		fi
	fi
	_message "  * AdvZIP: OK"
}

do_stage1()
{
	_header "Stage 1"
	
	_message "  * Cleaning up build stage directory..."
	rm -rv ./build/stage1 || /bin/true
	try mkdir -vp ./build/stage1
	
	_message "  * Merging sources..."
	tmp=`cat ./src/index2.html | grep -Eo '<script type="text/javascript" src="[^"]+"></script>' | cut -d \" -f 4`
	# scripts="_header.js $tmp _footer.js"
	scripts="$tmp"
	
	{
	echo '"use strict";'
	for i in $scripts; do
		echo ""
		echo ""
		echo ""
		echo "/* *** $i **************************************** */"
		echo ""
		cat "./src/$i" | grep -vE '^"use strict";$'
	done
	}  > ./build/stage1/merged.js
	
	_message "  * Copying files..."
	cp -v ./src/externs.js ./build/stage1/
	
	_message "  * Pre-processing sources..."
	cat ./build/stage1/merged.js| sed -e '/DEBUG BEGIN/,/\DEBUG END/{d}' > ./build/stage1/merged2.js
	
	tmp=`cat ./src/sprites.png | base64 -w 0`
	cat ./build/stage1/merged2.js | sed -e "s!./sprites.png!data:image/png;base64,${tmp}!g" | sed -e 's/true/1/g' | sed -e 's/false/0/g' > ./build/stage1/merged3.js
	
	_message "  * Running Closure Compiler (advanced optimizations, pretty print)..."
	try java -jar ./build/compiler/compiler.jar \
		--compilation_level ADVANCED_OPTIMIZATIONS \
		--use_types_for_optimization \
		--externs ./build/stage1/externs.js \
		--js ./build/stage1/merged3.js \
		--js_output_file ./build/stage1/minified1.js \
		--create_source_map ./build/stage1/minified1.js.map \
		--variable_renaming_report ./build/stage1/minified1.js.vars \
		--logging_level FINEST \
		--warning_level VERBOSE \
		--formatting PRETTY_PRINT \
		--formatting SINGLE_QUOTES \
		--summary_detail_level 3
	
	cd ./build/stage1
	
	ls -albtr
	
	cd ../..
}

do_stage2()
{
	_header "Stage 2"
	_message "  * Cleaning up build stage directory..."
	rm -rv ./build/stage2 || /bin/true
	try mkdir -vp ./build/stage2
	
	cp -v ./build/stage1/minified1.js ./build/stage2/
	
	_message "Client: running Closure Compiler (whitespace removal)..."
	try java -jar ./build/compiler/compiler.jar \
		--compilation_level WHITESPACE_ONLY \
		--js ./build/stage2/minified1.js \
		--js_output_file ./build/stage2/minified2.js \
		--logging_level FINEST \
		--warning_level VERBOSE \
		--summary_detail_level 3
	
	chmod -R ugo+rx ./build
	
	cd ./build/stage2
	zip -r9 minified2.js.zip minified2.js
	cat minified2.js | gzip -c9 > minified2.js.gz
	cat minified2.js | bzip2 -c9 > minified2.js.bz2
	cat minified2.js | lzma -c9 > minified2.js.lz
	
	ls -albtr
	
	cd ../..
	
}

do_stage3()
{
	_header "Stage 3"
	_message "  * Cleaning up build stage directory..."
	rm -rv ./build/stage3 || /bin/true
	try mkdir -vp ./build/stage3
	
	_message "Copying files..."
	try cp -v ./src/index.min.html ./build/stage2/minified2.js ./build/stage3/
	
	cat ./build/stage3/index.min.html | sed \
		-e '/\/\/ insert minified javascript here/{' \
		-e 'r ./build/stage2/minified2.js' \
		-e 'd}' \
		> ./build/stage3/index.html
	
	chmod -R ugo+rx ./build
	
	cd ./build/stage3
	zip -r9 game.zip index.html
	cat index.html | gzip -c9 > game.html.gz
	cat index.html | bzip2 -c9 > game.html.bz2
	cat index.html | lzma -c9 > game.html.lz
	
	ls -alb
	
	cd ../..
}

do_stage4()
{
	_header "Stage 4"
	_message "  * Cleaning up build stage directory..."
	rm -rv ./build/stage4 || /bin/true
	try mkdir -vp ./build/stage4
	
	_message "  * Copying files..."
	try cp -v ./build/stage3/game.zip ./build/stage4/
	
	cd ./build/stage4
	
	_message "  * Running AdvZIP..."
	if [ "$advzip_test_enabled" == "y" ]; then
		for i in 1 5 10 50 100 500 1000 5000 10000 50000 100000; do
			cp -v game.zip game_advzip_${i}.zip
			
			../advancecomp/advancecomp-1.20/advzip -z -4 -i $i     game_advzip_${i}.zip
		done
	else
		cp -v game.zip game_advzip.zip
	fi
	
	../advancecomp/advancecomp-1.20/advzip -z -4 -i 100 game_advzip.zip
	
	ls -albtr *.zip
	
	cd ../..
}

save()
{
	tar -c --one-file-system --numeric-owner --exclude ./build/compiler --exclude ./build/advancecomp ./src ./build | gzip -c9 > ./backups/${now}_package.tar.gz
}

cd ..

prepare

if [ "$stage1_enabled" == "y" ]; then
	do_stage1
fi

if [ "$stage2_enabled" == "y" ]; then
	do_stage2
fi

if [ "$stage3_enabled" == "y" ]; then
	do_stage3
fi

if [ "$stage4_enabled" == "y" ]; then
	do_stage4
fi

save

exit 0







if [ "$do_stage1" == "y" ]; then
	_message "Cleaning up build directories for stage 1..."
	rm -rfv ./build/stage1 || /bin/true
	try mkdir -vp ./build/stage1
	
	files=`cat ./src/index.html | grep -vE '<!--' | grep -vE 'window.onerror' | grep -E '<script.* src="([^"]+)"' | grep -Eo 'src=\".*\"' | cut -d \" -f 2 | grep -vE '/socket.io'`
	
	if [ ! -e ./src/server/server.js ] || [ ! -e ./src/server/server.min1.js ]; then
		_error "ERROR: checking server.js or server.min1.js failed."
		exit 1
	fi
	
	mtime_orig=`stat -c %Y ./src/server/server.js 2>/dev/null`
	mtime_min=`stat -c %Y ./src/server/server.min1.js 2>/dev/null`
	
	if [ $mtime_orig -gt $mtime_min ]; then
		_error "WARNING: server.js is more recent than server.min.js"
	fi
	
	_message "Copying files..."
	try cp -v ./src/index.html ./src/style.css ./src/server/package.json ./src/server/game.json ./build/stage1/
	try cp -v ./src/server/server.min1.js ./build/stage1/server.js
	
	_message "Removing debug sections, merging files and renaming some variables..."
	
	echo "\"use strict\";" > ./build/stage1/merged.js
	for i in $files; do
		cat ./src/$i | sed -e '/DEBUG BEGIN/,/\DEBUG END/{d}' | grep -vE '^\"use strict\";$' >> ./build/stage1/merged.js
	done
	
	_message "Embedding tileset.png into js..."
	tmp=`cat ./src/tileset.png | base64 -w 0`
	cat ./build/stage1/merged.js | sed -e "s!./tileset.png!data:image/png;base64,${tmp}!g" > ./build/stage1/merged2.js
	
	_message "Client: running Closure Compiler (advanced optimizations, pretty print)..."
	try java -jar ./build/compiler/compiler.jar \
		--compilation_level ADVANCED_OPTIMIZATIONS \
		--use_types_for_optimization \
		--externs ./src/externs.js \
		--js ./build/stage1/merged2.js \
		--js_output_file ./build/stage1/merged2.min1.js \
		--create_source_map ./build/stage1/merged2.min1.js.map \
		--variable_renaming_report ./build/stage1/merged2.min1.js.vars \
		--logging_level FINEST \
		--warning_level VERBOSE \
		--formatting PRETTY_PRINT \
		--formatting SINGLE_QUOTES \
		--summary_detail_level 3
	
	# not running Closure Compiler...
	try cp -v ./build/stage1/server.js ./build/stage1/server.min1.js
fi

if [ "$do_stage2" == "y" ]; then
	_message "Cleaning up build directories for stage 2..."
	rm -rfv ./build/stage2 || /bin/true
	
	try mkdir -vp ./build/stage2
	
	_message "Copying files..."
	try cp -v ./build/stage1/package.json ./build/stage1/game.json ./build/stage2
	
	_message "Client: running Closure Compiler (whitespace removal)..."
	try java -jar ./build/compiler/compiler.jar \
		--compilation_level WHITESPACE_ONLY \
		--js ./build/stage1/merged2.min1.js \
		--js_output_file ./build/stage2/merged2.min2.js \
		--logging_level FINEST \
		--warning_level VERBOSE \
		--summary_detail_level 3
	
	_message "Server: running Closure Compiler (whitespace removal)..."
	try java -jar ./build/compiler/compiler.jar \
		--compilation_level WHITESPACE_ONLY \
		--js ./build/stage1/server.min1.js \
		--js_output_file ./build/stage2/server.min2.js \
		--logging_level FINEST \
		--warning_level VERBOSE \
		--summary_detail_level 3
	
	_message "Optimizing style.css..."
	cat ./build/stage1/style.css | sed -r 's/^\s+//g' | sed -r 's/:\s+/:/g' | tr -d '\r' | tr -d '\n' | sed -e 's/;\}/\}/g' > ./build/stage2/style2.css
	
	_message "Embedding js and css into index.html..."
	cat ./build/stage1/index.html | sed -E 's,<script[^>]+></script>,,gi' | sed -E 's,<link type=\"text/css\"[^>]+>,,gi'| sed \
		-e '/<!-- insert minified javascript here -->/{' \
		-e 'i <script>' \
		-e 'r ./build/stage2/merged2.min2.js' \
		-e 'a </script><script src="/socket.io/socket.io.js"></script>' \
		-e 'd}' \
		-e '/<!-- insert minified css here -->/{' \
		-e 'i <style>' \
		-e 'r ./build/stage2/style2.css' \
		-e 'a </style>' \
		-e 'd}' \
		> ./build/stage2/index2.html
	
	_message "Optimizing index.html..."
	cat ./build/stage2/index2.html | grep -Ev '^\s+$' | sed -r 's/^\s+//g' | tr -d '\r' | tr '\n' ' ' | sed -e 's/> </></g' > ./build/stage2/index3.html
fi

if [ "$do_stage3" == "y" ]; then
	_message "Cleaning up build directories for stage 3..."
	rm -rfv ./build/stage3 || /bin/true
	
	try mkdir -vp ./build/stage3
	try mkdir -vp ./build/stage3/game
	
	_message "Copying files..."
	try cp -v ./build/stage2/index3.html  ./build/stage3/game/index.html
	try cp -v ./build/stage2/package.json ./build/stage3/game/
	try cp -v ./build/stage2/server.min2.js  ./build/stage3/game/server.js
	try cp -v ./build/stage2/game.json ./build/stage3/
	
	try cd ./build
	
	now=`date +%Y%m%d_%H%M%S`
	git_id=`git log -1 --format="%H" 2>/dev/null`
	if [ "$git_id" == "" ]; then
		git_id="unknown"
	else
		git status --porcelain | grep -vE '^\?\?' | wc -l | grep -Eq '^0$'
		if [ $? != 0 ]; then
			git_id="${git_id}-modified"
		fi
	fi
	zip_file="${name}_${now}_${git_id}.zip"
	
	try cd ..
	
	_message "Creating new archive ${zip_file} ..."
	try cd ./build/stage3
	try zip ../${zip_file} -r -9 .
	try cd ../..
	
	_message "Build finished."
	
	du -b ./src ./build/stage1 ./build/stage2 ./build/stage3 ./build/${zip_file}
	
	size=`du -b ./build/${zip_file} | awk '{ print $1; }'`
	if [ "$is_js13k" == "y" ]; then
		if [ $size -gt 13312 ]; then
			_error "ERROR: Zipped file is over the 13 kB limit with $((size - 13312)) bytes."
			exit 1
		elif [ $size == 13312 ]; then
			_message "Great success, zipped file is EXACTLY 13 kB, don't touch it, SUBMIT NOW. :)"
		else
			_message "Great success, zipped file is smaller than 13 kB, still have $((13312 - size)) bytes for fun."
		fi
	else
		if [ $size -gt 13312 ]; then
			_message "Final size is ${size} bytes, $((size - 13312)) bytes over the js13k limit."
		else
			_message "Final size is ${size} bytes, $((13312 - size)) bytes left until the js13k limit."
		fi
	fi
fi

exit 0
