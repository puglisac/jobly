CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL,
    num_employees integer NOT NULL,
    description text NOT NULL,
    logo_url text NOT NULL
);