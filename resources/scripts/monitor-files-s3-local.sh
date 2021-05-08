#!/bin/bash
#inotifywait example for s3 hooks
inotifywait -m . -e create -e moved_from |
    while read dir action file; do
        echo "The file '$file' appeared in directory '$dir' via '$action'"
        # do something with the file
    done