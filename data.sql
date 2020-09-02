CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL,
    num_employees integer NOT NULL,
    description text NOT NULL,
    logo_url text NOT NULL
);

CREATE TABLE jobs
(
    id serial PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL CHECK (equity BETWEEN 0 AND 1),
    company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted timestamptz NOT NULL DEFAULT current_timestamp
);