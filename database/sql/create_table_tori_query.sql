CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE toriquery (
  id SERIAL PRIMARY KEY,
  app_user INT REFERENCES app_user(id) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);