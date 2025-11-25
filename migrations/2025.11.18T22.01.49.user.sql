CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(30) NOT NULL,
    passwordHash VARCHAR(30) NOT NULL
);