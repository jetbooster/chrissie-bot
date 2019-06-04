#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

RED='\033[0;31m'
GREEN='\033[0;32m'
CLEAR='\033[0m'

if [[ -f ${DIR}/current.pid ]]; then
	echo -e "${RED}An instance of the bot is currently running. use ./stop.sh or 'npm stop' to stop it${CLEAR}"
	exit 1
fi

: > nohup.out # clear existing log file

# If bot is started abnormally in daemon mode it can linger and continue to attempt to respond with deprecated responses. require an arbitrary boot arg
nohup node index.js --started-correctly &
echo $! >${DIR}/current.pid

echo -e "${GREEN}Bot running as daemon. Use ./stop.sh or 'npm stop'${CLEAR}"
