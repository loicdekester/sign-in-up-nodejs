/**  Creates table Users. */
CREATE TABLE users
(
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL
)
