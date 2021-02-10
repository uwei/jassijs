#!/bin/sh
#pkg install postgresql
#mkdir -p $PREFIX/var/lib/postgresql
#initdb $PREFIX/var/lib/postgresql
exec node server/main2.js
#pg_ctl -D $PREFIX/var/lib/postgresql stop