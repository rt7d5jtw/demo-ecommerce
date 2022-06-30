#!/bin/sh

# This script is for running a deployment, for api only, w/o client directory
# This script is meant to be run in the actual docker container, copy it over

command -v curl >/dev/null 2>&1 || { echo >&2 "curl is required for this script to run, but it's not installed. Aborting."; exit 1; }
command -v sed >/dev/null 2>&1 || { echo >&2 "sed is required for this script to run, but it's not installed. Aborting."; exit 1; }

if [ -f "$token_test" ]; then
    rm -fv token.txt
      echo "Removed token.txt for the test"
fi

# test the signin endpoint for generating jwt token and save it into token.txt file
if curl -X POST http://127.0.0.1:3000/auth/signin -H 'Content-Type: application/json' -d '{"email": "meemau@gmail.com", "password": "habbo1234"}' > token.txt ; then
    cat token.txt
    echo "JWT Token succesfully generated"
fi

token_test=$(sed -E 's/.*"accessToken":"?([^,"]*)"?.*/\1/' token.txt)

# tests the users endpoint with the jwt token
curl -H 'Accept: application/json' -H "Authorization: Bearer $token_test" http://127.0.0.1:3000/users
