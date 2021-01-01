CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

-- Represents a saved tori.fi search
CREATE TABLE toriquery (
  id SERIAL PRIMARY KEY,
  app_user INT REFERENCES app_user(id) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL CHECK (url LIKE 'https://www.tori.fi/%'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Represents a tori.fi item which is for sale
CREATE TABLE toriitem (
  id SERIAL PRIMARY KEY,
  item_url TEXT NOT NULL,
  title TEXT NOT NULL,
  search_query INT REFERENCES toriquery(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- there can't be duplicate items for single query, but same item can appear
  -- in multiple queries
  UNIQUE (item_url, search_query)
);
