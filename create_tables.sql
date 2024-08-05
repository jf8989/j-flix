-- Create the Movies table
CREATE TABLE Movies (
    MovieID SERIAL PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    ImageURL VARCHAR(255),
    Featured BOOLEAN DEFAULT FALSE
);

-- Create the Directors table
CREATE TABLE Directors (
    DirectorID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Bio TEXT,
    BirthYear INTEGER,
    DeathYear INTEGER
);

-- Create the Genres table
CREATE TABLE Genres (
    GenreID SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Description TEXT
);

-- Create the Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    BirthDate DATE
);

-- Create the Users_Movies table (for favorite movies)
CREATE TABLE Users_Movies (
    UserID INTEGER REFERENCES Users(UserID),
    MovieID INTEGER REFERENCES Movies(MovieID),
    PRIMARY KEY (UserID, MovieID)
);

-- Add foreign key constraints to the Movies table
ALTER TABLE Movies
ADD COLUMN DirectorID INTEGER REFERENCES Directors(DirectorID),
ADD COLUMN GenreID INTEGER REFERENCES Genres(GenreID);

-- Create indexes for better query performance
CREATE INDEX idx_movies_title ON Movies(Title);
CREATE INDEX idx_directors_name ON Directors(Name);
CREATE INDEX idx_genres_name ON Genres(Name);
CREATE INDEX idx_users_username ON Users(Username);