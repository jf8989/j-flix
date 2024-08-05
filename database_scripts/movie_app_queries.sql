-- 1. Select a single genre and all movies of that genre
-- First, select the GenreID for 'Sci-Fi'
SELECT GenreID FROM Genres WHERE Name = 'Sci-Fi';

-- Then, use that GenreID to find all movies of that genre
SELECT m.Title, m.Description
FROM Movies m
JOIN MovieGenres mg ON m.MovieID = mg.MovieID
WHERE mg.GenreID = (SELECT GenreID FROM Genres WHERE Name = 'Sci-Fi');

-- 2. Update a user's email address
UPDATE Users
SET Email = 'newemailaddress@example.com'
WHERE Username = 'moviebuff';

-- 3. Delete a movie from the database
-- First, remove any references in MovieGenres and UserMovies
DELETE FROM MovieGenres WHERE MovieID = (SELECT MovieID FROM Movies WHERE Title = 'Tenet');
DELETE FROM UserMovies WHERE MovieID = (SELECT MovieID FROM Movies WHERE Title = 'Tenet');

-- Then delete the movie itself
DELETE FROM Movies WHERE Title = 'Tenet';

-- Comments explaining each query
-- The first query demonstrates how to use a subquery to find movies of a specific genre
-- The second query shows how to update a user's information
-- The third query illustrates the process of deleting a movie, including cleaning up related tables