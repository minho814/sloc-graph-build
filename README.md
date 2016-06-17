NOTE: Doesn't work right now

Run the curl command in your local terminal to run a script that automatically
scrapes the versions of the hostname input. 

```.sh
curl -X POST \
     -F token=87e670425133c9f49087a72c5cd003 \
     -F "ref=master" \
     -F "variables[HOST_NAME]="HOST_NAME_FOR_VERSIONING""\
     -F "variables[PASSWORD]="PASSWORD_OF_HOSTNAME"" \
     https://gitlab.e1c.net/api/v3/projects/836/trigger/builds
```

Here's an example with a fake password:
```.sh
curl -X POST \
     -F token=87e670425133c9f49087a72c5cd003 \
     -F "ref=master" \
     -F "variables[HOST_NAME]=c30.int.e1c.net"\
     -F "variables[PASSWORD]="password"" \
     https://gitlab.e1c.net/api/v3/projects/836/trigger/builds
```