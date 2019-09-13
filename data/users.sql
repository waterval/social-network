CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    forename VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    image VARCHAR(255),
    biography TEXT,
    birthday_day INT,
    birthday_month INT,
    birthday_year INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
