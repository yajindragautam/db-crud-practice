-- Create a locales tables
CREATE TABLE locales(
	id SERIAL PRIMARY KEY,
	code Varchar(20),
	UNIQUE(code)
);

-- Create a translationcodes table
CREATE TABLE translationcodes(
	id SERIAL PRIMARY KEY,
	translationcode VARCHAR(20),
	UNIQUE(translationcode),
);

-- Create a translations table
CREATE TABLE translations(
	id SERIAL PRIMARY KEY,
	translationcodeid INTEGER,
	languagetext TEXT,
	localeid INTEGER,
	FOREIGN KEY (translationcodeid) REFERENCES translationcodes (id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (localeid) REFERENCES locales (id) ON DELETE CASCADE ON UPDATE CASCADE 
);