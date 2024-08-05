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
INSERT INTO Movies (Title, Description, ImageURL, Featured, DirectorID) VALUES
('Inception', 'A thief who enters the dreams of others', 'http://example.com/inception.jpg', TRUE, 1),
('Interstellar', 'A team of explorers travel through a wormhole in space', 'http://example.com/interstellar.jpg', FALSE, 1),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, and others intertwine', 'http://example.com/pulpfiction.jpg', TRUE, 2),
('Once Upon a Time in Hollywood', 'A faded TV actor and his stunt double strive to achieve success', 'http://example.com/onceuponatime.jpg', FALSE, 2),
('Lady Bird', 'A nurse works tirelessly to keep her family afloat', 'http://example.com/ladybird.jpg', FALSE, 3),
('Little Women', 'The lives of the March sisters in 1860s New England', 'http://example.com/littlewomen.jpg', TRUE, 3),
('Dunkirk', 'Allied soldiers are evacuated during a fierce battle in World War II', 'http://example.com/dunkirk.jpg', FALSE, 1),
('Tenet', 'A secret agent embarks on a dangerous mission to prevent World War III', 'http://example.com/tenet.jpg', TRUE, 1),
('Inglourious Basterds', 'A group of Jewish U.S. soldiers plot to assassinate Nazi leaders', 'http://example.com/inglourious.jpg', FALSE, 2),
('Barbie', 'Barbie and Ken are having the time of their lives in Barbie Land', 'http://example.com/barbie.jpg', TRUE, 3);

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

-- Comments explaining the data insertion process
-- We first insert data into tables without foreign key constraints (Directors, Genres, Users)
-- Then we insert data into the Movies table, referencing DirectorIDs
-- We populate the junction tables (MovieGenres, UserMovies) to establish relationships
-- This approach ensures we don't violate any foreign key constraints