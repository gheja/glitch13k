#!/bin/bash

tmp=`realpath "$0"`
dir=`dirname "$tmp"`

cd "$dir/.."

last=""

while [ 1 ]; do
	new=`find ./src -type f -printf '%C@,%T@,%s,%M,%G,%U,%p\n' | grep -v '.#'`
	
	if [ "$new" != "$last" ]; then
		sleep 0.5
		date '+%Y-%m-%d %H:%M:%S'
		./scripts/update.sh
		last="$new"
	fi
	
	sleep 0.1
done
