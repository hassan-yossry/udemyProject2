## Database Build in postgres

CREATE DATABASE store_db;
CREATE DATABASE store_db_test;
CREATE USER store_admin WITH password 'pass123';
GRANT ALL PRIVILEGES ON DATABASE store_db TO store_admin;
GRANT ALL PRIVILEGES ON DATABASE store_db_test TO store_admin;

### Database Scheme
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price INTEGER
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    complete BOOLEAN
);

CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER
);
### USERS ROUTES
A LOGIN ROUTE /user/login [POST] [first_name,last_name, password] in request body
A CREATE ROUTE /users [POST]
AN INDEX ROUTE /users [GET] [NEEDS TOKEN]
A SHOW ROUTE /users/:uid [GET] [NEEDS TOKEN]
A DELETE ROUTE /users [DELETE] [NEEDS TOKEN]

### PRODUCTS ROUTES
A CREATE ROUTE /products [POST] [NEEDS TOKEN]
AN INDEX ROUTE /products [GET] 
A SHOW ROUTE /products/:uid [GET] 
A DELETE ROUTE /products [DELETE]

### orders ROUTES
A CREATE ROUTE /orders [POST] 
AN INDEX ROUTE /orders [GET] 
A SHOW ROUTE /orders/:uid [GET] 
A DELETE ROUTE /orders [DELETE]
A LIST ORDERS FROM USER ROUTE /orders/user/:uid [GET]

### Environement Variables

PG_HOST="HOST IP ADD"
PG_DB="database name" "store_db"
PG_DB_TST="test database name" "store_db_test"
PG_USER="admin user namee" "store_admin"
PG_PASSWORD="admin password" "pass123"
TOKEN_SECRET=" token encrypt secret""THis a SecRET"
ENV="dev"

### usage
to install dependencies
yarn add
npm i jasmine -g


to start the server
npm run start

to test
npm run test

to compile typescript
npm run tsc


