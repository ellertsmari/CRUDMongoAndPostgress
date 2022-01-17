# CRUD operations with Mongo And Postgres

The only thing you need to do to make this back-end work is to install the modules with `yarn` or `npm -i` and add an .env file. What should be in that file is:
```
# PostgreSQL environment variables:
PGHOST=localhost
PGUSER=postgres
PGDATABASE=postgres
PGPASSWORD=<your postgres password here>
PGPORT=5432

# MongoDB environment variables:
MONGOPASS=<your mongo password here>
```

This is what should be in the file when you are using all default values and running on local host. Of course normally you would name your database something else
The user would also be something else and the host would probably be some IP address or a url to some PostgreSQL server...
