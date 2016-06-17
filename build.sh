#!/bin/bash

if [ -z "$HOST_NAME" ];
	then
		echo "Missing Host"; exit 1
fi

ssh-keygen -R $HOST_NAME

echo "Creating HTML Table for $HOST_NAME"
export SSHPASS="$PASSWORD"
TABLE="$(sshpass -e ssh -o StrictHostKeyChecking=no root\@$HOST_NAME 'bash -s' < ./htmlMaker.sh)"
echo "$TABLE" > "${HOST_NAME}".html

unset HOST_NAME
unset PASSWORD
