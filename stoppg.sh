#!/bin/sh
#pkg install postgresql
#mkdir -p $PREFIX/var/lib/postgresql
#initdb $PREFIX/var/lib/postgresql
exec pg_ctl -D $PREFIX/var/lib/postgresql stop
#pg_ctl -D $PREFIX/var/lib/postgresql stop