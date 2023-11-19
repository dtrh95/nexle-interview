Create ```.env``` file

```
PORT=4000

DB_HOST=<db_host>
DB_NAME=<database_name>
DB_PORT=<database_port>
DB_USER=<database_username>
DB_PASSWORD=<database_password>

JWT_REFRESH_TOKEN_EXPIRATION_TIME=2592000 // in seconds = 30 days
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900 // in seconds = 1h

JWT_SECRET=<secret_key>
```

Development mode:
```
npm run start:dev

```


To build:
```
npm run build

```

To start production build:
```
npm run start

```
