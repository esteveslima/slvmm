#!/bin/sh

# Check whether the deploy is not running in the wrong environment

RED="\033[0;31m"
CYAN="\033[0;36m"
NO_COLOR="\033[0m"

printf "\n";

if  [ $SLS_STAGE != "local" ]#TODO:NEEDS REFACTORING SINCE ENV VARIABLE SLS_STAGE ISN'T AVAILABLE IN THIS NEW STRUCTURE
then 
    printf "${CYAN}Serverless script plugin: detected deploy in stage \"$SLS_STAGE\"${NO_COLOR}";
    STATUS=0;
else 
    printf "${RED}Serverless script plugin: CANNOT RUN \"DEPLOY\" COMMAND WITH STAGE \"local\"${NO_COLOR}";
    STATUS=1;
fi

printf "\n";
printf "\n";

exit $STATUS;