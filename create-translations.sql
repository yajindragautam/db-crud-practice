
-- Create a locales tables
CREATE TABLE locales(
	id SERIAL PRIMARY KEY,
	code Varchar(20),
	UNIQUE(code)
);

-- Create a translationcodes tables

CREATE TABLE translationcodes(
	id SERIAL PRIMARY KEY,
	translationcode Varchar(20),
	UNIQUE(translationcode)
);

-- CReate a translations table

CREATE TABLE translations(
	id SERIAL PRIMARY KEY,
	translationcodeid interger,
	test varchar not null,
	localeid integer,
    FOREIGN KEY (translationcodeid) REFERENCES translationcodes (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (localeid) REFERENCES locales (id) ON DELETE CASCADE ON UPDATE CASCADE
);