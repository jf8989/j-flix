-- 1. Read a single genre from the genre table by name
SELECT * FROM Genres WHERE Name = 'Science Fiction';

-- Read all movies of the same genre
SELECT m.* FROM Movies m
JOIN Genres g ON m.GenreID = g.GenreID
WHERE g.Name = 'Science Fiction';

-- 2. Update the email address of a single user by name
UPDATE Users
SET Email = 'newemail@example.com'
WHERE Username = 'moviebuff';

-- 3. Delete a certain movie from the database
DELETE FROM Movies WHERE Title = 'Ready Player One';

-- Verify that we still have at least 2 movies with the same director and genre
SELECT d.Name AS Director, g.Name AS Genre, COUNT(*) AS MovieCount
FROM Movies m
JOIN Directors d ON m.DirectorID = d.DirectorID
JOIN Genres g ON m.GenreID = g.GenreID
GROUP BY d.Name, g.Name
HAVING COUNT(*) >= 2;