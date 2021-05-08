#!/bin/sh

#DEPRECATED: using profiles in credentials file

# Switch AWS Credentials to production by exporting "credentials-prod" keys...
# ...this way only the deployment command(which requires prod keys) will be granted permission...
# ...and will avoid potential accidental aws-cli commands to production.

# RED="\033[0;31m"
# CYAN="\033[0;36m"
# NO_COLOR="\033[0m"

# printf "\n";

# # reference from serverless file
# CREDENTIALS_FILE="../../resources/.aws/credentials-prod"
# AWS_ACCESS_KEY_ID=$(awk -F'=' '/aws_access_key_id/{print $NF}' $CREDENTIALS_FILE)
# AWS_SECRET_ACCESS_KEY=$(awk -F'=' '/aws_secret_access_key/{print $NF}' $CREDENTIALS_FILE)

# # export AWS_ACCESS_KEY_ID
# # export AWS_SECRET_ACCESS_KEY
# # printenv

# serverless config credentials --provider aws --key $AWS_ACCESS_KEY_ID --secret $AWS_SECRET_ACCESS_KEY --overwrite

# printf "${CYAN}AWS credentials switched to production${NO_COLOR}"; 
# STATUS=0;

# printf "\n";
# printf "\n";

# exit $STATUS;