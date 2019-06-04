#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

RED='\033[0;31m'
GREEN='\033[0;32m'
CLEAR='\033[0m'

if [[ ! -f ${DIR}/current.pid ]]; then
	echo -e "${RED}No recorded instances of the bot to stop. If you think this is an error, use 'ps -aux | grep node' and stop it manually${CLEAR}"
	exit 1
fi

kill $( cat ${DIR}/current.pid ) && rm ${DIR}/current.pid

echo -e "${GREEN}Bot successfully stopped${CLEAR}"
