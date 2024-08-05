-- Create Movies table
CREATE TABLE Movies (
    MovieID SERIAL PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    ImageURL VARCHAR(255),
    Featured BOOLEAN DEFAULT FALSE,
    release_year INTEGER,
    rating DECIMAL(3,1)
);

-- Create Directors table
CREATE TABLE Directors (
    DirectorID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Bio TEXT,
    BirthYear INTEGER,
    DeathYear INTEGER
);

-- Create Genres table
CREATE TABLE Genres (
    GenreID SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Description TEXT
);

-- Create Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    BirthDate DATE
);

-- Create MovieGenres table
CREATE TABLE MovieGenres (
    MovieID INTEGER REFERENCES Movies(MovieID),
    GenreID INTEGER REFERENCES Genres(GenreID),
    PRIMARY KEY (MovieID, GenreID)
);

-- Create UserMovies table
CREATE TABLE UserMovies (
    UserID INTEGER REFERENCES Users(UserID),
    MovieID INTEGER REFERENCES Movies(MovieID),
    PRIMARY KEY (UserID, MovieID)
);

-- Create Actors table
CREATE TABLE Actors (
    ActorID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    BirthYear INTEGER
);

-- Create MovieActors junction table
CREATE TABLE MovieActors (
    MovieID INTEGER REFERENCES Movies(MovieID),
    ActorID INTEGER REFERENCES Actors(ActorID),
    PRIMARY KEY (MovieID, ActorID)
);

-- Add foreign key for Director in Movies table
ALTER TABLE Movies ADD COLUMN DirectorID INTEGER REFERENCES Directors(DirectorID);

-- Insert Directors
INSERT INTO Directors (Name, Bio, BirthYear, DeathYear) VALUES
('Christopher Nolan', 'British-American filmmaker known for his cerebral films', 1970, NULL),
('Quentin Tarantino', 'American filmmaker known for nonlinear storytelling', 1963, NULL),
('Greta Gerwig', 'American actress and filmmaker', 1983, NULL);

-- Insert Genres
INSERT INTO Genres (Name, Description) VALUES
('Sci-Fi', 'Science fiction genre'),
('Thriller', 'Suspenseful, exciting stories'),
('Drama', 'Character and plot driven narratives');

-- Insert Movies
INSERT INTO Movies (Title, Description, ImageURL, Featured, DirectorID, release_year, rating) VALUES
('Inception', 'A thief who enters the dreams of others', 'http://example.com/inception.jpg', TRUE, 1, 2010, 8.8),
('Interstellar', 'A team of explorers travel through a wormhole in space', 'http://example.com/interstellar.jpg', FALSE, 1, 2014, 8.6),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, and others intertwine', 'http://example.com/pulpfiction.jpg', TRUE, 2, 1994, 8.9),
('Once Upon a Time in Hollywood', 'A faded TV actor and his stunt double strive to achieve success', 'http://example.com/onceuponatime.jpg', FALSE, 2, 2019, 7.6),
('Lady Bird', 'A nurse works tirelessly to keep her family afloat', 'http://example.com/ladybird.jpg', FALSE, 3, 2017, 7.4),
('Little Women', 'The lives of the March sisters in 1860s New England', 'http://example.com/littlewomen.jpg', TRUE, 3, 2019, 7.8),
('Dunkirk', 'Allied soldiers are evacuated during a fierce battle in World War II', 'http://example.com/dunkirk.jpg', FALSE, 1, 2017, 7.8),
('Tenet', 'A secret agent embarks on a dangerous mission to prevent World War III', 'http://example.com/tenet.jpg', TRUE, 1, 2020, 7.3),
('Inglourious Basterds', 'A group of Jewish U.S. soldiers plot to assassinate Nazi leaders', 'http://example.com/inglourious.jpg', FALSE, 2, 2009, 8.3),
('Barbie', 'Barbie and Ken are having the time of their lives in Barbie Land', 'http://example.com/barbie.jpg', TRUE, 3, 2023, 7.0);

-- Insert MovieGenres
INSERT INTO MovieGenres (MovieID, GenreID) VALUES
(1, 1), (1, 2), -- Inception: Sci-Fi, Thriller
(2, 1), (2, 3), -- Interstellar: Sci-Fi, Drama
(3, 2), (3, 3), -- Pulp Fiction: Thriller, Drama
(4, 3), -- Once Upon a Time in Hollywood: Drama
(5, 3), -- Lady Bird: Drama
(6, 3), -- Little Women: Drama
(7, 2), (7, 3), -- Dunkirk: Thriller, Drama
(8, 1), (8, 2), -- Tenet: Sci-Fi, Thriller
(9, 2), (9, 3), -- Inglourious Basterds: Thriller, Drama
(10, 3); -- Barbie: Drama

-- Insert Users
INSERT INTO Users (Username, Password, Email, BirthDate) VALUES
('moviebuff', 'password123', 'moviebuff@example.com', '1990-01-01'),
('cinephile', 'securepass', 'cinephile@example.com', '1985-05-15'),
('filmfan', 'qwerty789', 'filmfan@example.com', '1995-12-31');

-- Insert UserMovies (Favorites)
INSERT INTO UserMovies (UserID, MovieID) VALUES
(1, 1), (1, 3), (1, 6), -- moviebuff's favorites
(2, 2), (2, 5), (2, 8), -- cinephile's favorites
(3, 4), (3, 7), (3, 10); -- filmfan's favorites

-- Insert sample actors
INSERT INTO Actors (Name, BirthYear) VALUES
('Leonardo DiCaprio', 1974),
('Meryl Streep', 1949),
('Denzel Washington', 1954);

-- Insert sample MovieActors relationships
INSERT INTO MovieActors (MovieID, ActorID) VALUES
(1, 1), -- Inception - Leonardo DiCaprio
(2, 1), -- Interstellar - Leonardo DiCaprio
(3, 2), -- Pulp Fiction - Meryl Streep (this is fictional, for demonstration)
(4, 3); -- Once Upon a Time in Hollywood - Denzel Washington (also fictional)

-- Query to demonstrate the new relationship
SELECT m.Title, m.release_year, m.rating, a.Name as Actor
FROM Movies m
JOIN MovieActors ma ON m.MovieID = ma.MovieID
JOIN Actors a ON ma.ActorID = a.ActorID
ORDER BY m.Title;