#!/bin/bash

HOST="$(hostname)" # server/host name (e.g. cs30-ps01)

APACHEv="$(apache2 -v | grep -Po '\d+\.(\d+\.)?(\*|\d+)')" # Apache Webserver Version
APACHEd="https://httpd.apache.org/docs/" # Apache Documentation
APACHEp="$(which apache2)"

CHEFv="$(head /var/log/chef-solo.log | grep '\*\*\*' | awk '{print $5}')" # Chef version
CHEFd="https://docs.chef.io/" # Chef Documentation

ELECTSSv="$(wget http://localhost:8888/api/status 2> /dev/null && cat status | grep -Po '(\d+\.)?(\d+\.)?(\*|\d+)')" # eLect Security Suite 

ELECT="$(wget http://localhost/qua/system_status 2> /dev/null && cat system_status | grep -Po '"version":.*?[^\\]",' | tr \"  " " | awk '{print $3}')" # eLect
rm *status* 2> /dev/null # remove the status created from above commands

FESTIVALv="$(festival --version | grep -Po '\d+\.(\d+\.)?(\*|\d+)')" # Festival version
FESTIVALd="http://www.festvox.org/docs/" # Festival Documentation

LAMEv="$(lame --version | head -n1 | awk '{print $4}')" # LAME version
LAMEd="http://lame.sourceforge.net/using.php" # LAME Documentation

JAVAv="$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}')" # Java version
JAVAd="https://docs.oracle.com/javase/8/docs/api/index.html" # Java Documentation
JAVAp="$(which java)" # Path to Java

MARIADBv="$(echo "\s" | mysql elect | grep "Server version:" | grep -Po '\d+\.(\d+\.)?(\*|\d+)')" # MariaDB version
MARIADBd="https://mariadb.com/kb/en/mariadb/documentation/"
MARIADBp="$(cat /etc/mysql/my.cnf | grep datadir | awk '{print $3}')"

NODEv="$(node -v | cut -c 2-)" # Node version
NODEd="https://nodejs.org/en/docs/" # Node documentation 
NODEp="$(which node)" # Path to Node

OPENSSLv="$(openssl version | awk '{print $2}')" # OpenSSL Version
OPENSSLd="https://www.openssl.org/docs/" # OpenSSL Documentation
OPENSSLp="$(which openssl)"

OPENVPNv="$(openvpn --version | head -n 1 | awk '{print $2}')" # OpenVPN version
OPENVPNd="https://openvpn.net/index.php/open-source/documentation.html" # OpenVPN Documentation
OPENVPNp="$(which openvpn)"

OSvL="$(uname -a | awk '{print $3}')" #OS version for Linux

OSvU="$(lsb_release -a 2>/dev/null | grep 'Description' | awk '{print $3}')" #OS version for Ubuntu
OSdU="https://help.ubuntu.com/" # OS documentation for Ubuntu

PERLv="$(perl -v | grep -Po 'v(\d+\.)?(\d+\.)?(\*|\d+)' | cut -c 2-)" # Perl version
PERLd="http://perldoc.perl.org/" # Perl documentation
PERLp="$(which perl)" # Path to Perl

TOMCATv="$(java -cp /usr/share/java/catalina.jar org.apache.catalina.util.ServerInfo | head -n 1 | grep -Po '\d+\.(\d+\.)?(\*|\d+)')" # Tomcat version
TOMCATd="http://tomcat.apache.org/whichversion.html" # Tomcat documentation on left column
TOMCATp="$(ps -ef | grep -Po 'catalina.home=[^\s]+' | head -n -1 | cut -c15-)" # Path to Tomcat

JARs="$(find /var/lib/tomcat6/webapps -name "*.war" | xargs -L1 unzip -l | sed 's!.*/!!' | grep -v 'SNAPSHOT' | grep '.jar' | sort | uniq)" # JARs in WARs
NPMs="$(npm -g ls | sed 's/[^.a-zA-Z0-9@-]//g' | tail -n +2 | head -n -1 | sort | tr @ " ")" # Global Node modules
OSps="$(dpkg -l | tail -n +6 | awk '{print $2 " " $3}')"  # OS packages
PERLm="$(dpkg -l | grep 'lib.*\?-perl' | awk '{print $2 " " $3}')" # Perl modules + versions

# Extract version numbers from JARs
while IFS= read -r line 
do
    var=$var"\n"$(echo $line | grep -Po '\d+\.(\d+\.)?(\*|\d+)')
done <<< "$JARs"

JARv="$(echo -e $var | tail -n +2)"
JARsv="$(paste <(echo "$JARs") <(echo "$JARv") --delimiters ' ')"

# HTML Headers
echo "<!DOCTYPE html>
<html>
<head>
<style>
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
th, td {
    padding: 5px;
    text-align: left;
}
table tr:nth-child(even) {
    background-color: #c5e3ed;
}
table tr:nth-child(odd) {
   background-color:#fff;
}
table th {
    background-color: black;
    color: white;
}
</style>
<title>$HOST Versions</title>
</head>
<body>
<h1>$HOST</h1>" 

# Table for main versions
echo "<h2>Versions</h2>
<table>" 
echo "Name Version DocumentationURL FilePath" | 
    awk '{print "<tr><th>" $1 "</th><th>" $2 "</th><th>" $3 "</th><th>" $4 "</th></tr>" }' 
echo "ApacheWebserver $APACHEv $APACHEd $APACHEp
Chef $CHEFv $CHEFd
eLectSecuritySuite $ELECTSSv
eLect $ELECT
Festival $FESTIVALv $FESTIVALd
Java $JAVAv $JAVAd $JAVAp
LAME $LAMEv $LAMEd 
MariaDB $MARIADBv $MARIADBd $MARIADBp 
Node $NODEv $NODEd $NODEp
OpenSSL $OPENSSLv $OPENSSLd $OPENSSLp
OPENVPN $OPENVPNv $OPENVPNd $OPENVPNp
OS_Linux $OSvL 
OS_Ubuntu $OSvU $OSdU
Perl $PERLv $PERLd $PERLp
Tomcat $TOMCATv $TOMCATd $TOMCATp" | 
    awk '{print "<tr><td>" $1 "</td><td>" $2 "</td><td><a href=" $3 ">" $3 "</a></td><td>" $4 "</td></tr>" }' 
echo "</table>
<br>" 

# Table for OS Packages
echo "<h2>OS Packages</h2>
<table>
<tr><th>OS Package</th><th>Version</th></tr>"
echo "$OSps" | awk '{print "<tr><td>" $1 "</td><td>" $2 "</td></tr>" }'
echo "</table>
<br>" 

# Table for Perl Modules
echo "<h2>Perl Modules</h2>
<table>
<tr><th>Perl Module</th><th>Version</th></tr>" 
echo "$PERLm" | awk '{print "<tr><td>" $1 "</td><td>" $2 "</td></tr>" }'
echo "</table>
<br>"

# Table for Node Modules
echo "<h2>Node Modules</h2>
<table>
<tr><th>Node Module</th><th>Version</th></tr>" 
echo "$NPMs" | awk '{print "<tr><td>" $1 "</td><td>" $2 "</td></tr>" }'
echo "</table>
<br>"

# Table for JARs in WARs and versions
echo "<h2>JARs in WARs and Versions</h2>
<table>
<tr><th>JARs</th><th>Version</th></tr>"
echo "$JARsv" | awk '{print "<tr><td>" $1 "</td><td>" $2 "</td></tr>" }'
echo "</table>
<br>" 

echo "</body>
</html>"
