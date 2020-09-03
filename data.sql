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

CREATE TABLE users 
(
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    photo_url text,
    is_admin boolean NOT NULL DEFAULT false
);

CREATE TABLE applications
(
    id serial PRIMARY KEY,
    username text REFERENCES users, 
    job_id integer REFERENCES jobs,
    state text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT current_timestamp
);