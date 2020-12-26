CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL
);

CREATE TABLE toriquery (
  id SERIAL PRIMARY KEY,
  app_user INT REFERENCES app_user(id),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
