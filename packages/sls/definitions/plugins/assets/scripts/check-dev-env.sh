#!/bin/sh

CONTAINER_DIR="/slvmm"

RED="\033[0;31m"
CYAN="\033[0;36m"
BLACK="\033[0;30m"
NO_COLOR="\033[0m"



printf "\n";

# Script escape option
if [ "$SLS_MODE" = "no-scripts" ]
then
    printf "${CYAN}Serverless script plugin disabled: "$0"${NO_COLOR}";
    printf "\n";
    printf "\n";
    exit 0;
fi

# Check whether the current environment is the docker container
if (grep 'docker\|lxc' /proc/1/cgroup -qa) && [ "${PWD##$CONTAINER_DIR}" != "${PWD}" ]
then 
    printf "${CYAN}Serverless script plugin: Detected docker environment${NO_COLOR}"; 
    STATUS=0;
else 
    printf "${RED}Serverless script plugin: USE DOCKER ENVIRONMENT${NO_COLOR}";
    printf "${BLACK}\t(Disable this verification script with SLS_MODE=no-scripts)${NO_COLOR}";
    STATUS=1;
fi
printf "\n";
printf "\n";
exit $STATUS;