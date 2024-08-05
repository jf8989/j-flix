-- Insert data into Directors table
INSERT INTO Directors (Name, Bio, BirthYear, DeathYear) VALUES
('Christopher Nolan', 'British-American film director known for mind-bending narratives', 1970, NULL),
('Quentin Tarantino', 'American film director known for nonlinear storylines', 1963, NULL),
('Steven Spielberg', 'American filmmaker, considered one of the founding pioneers of the New Hollywood era', 1946, NULL);

-- Insert data into Genres table
INSERT INTO Genres (Name, Description) VALUES
('Science Fiction', 'Imaginative and futuristic concepts'),
('Crime', 'Stories about criminal activities'),
('Adventure', 'Exciting experiences or undertakings');

-- Insert data into Movies table
INSERT INTO Movies (Title, Description, ImageURL, Featured, DirectorID, GenreID) VALUES
('Inception', 'A thief who enters the dreams of others to steal secrets from their subconscious.', 'https://example.com/inception.jpg', TRUE, 1, 1),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'https://example.com/interstellar.jpg', TRUE, 1, 1),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'https://example.com/pulpfiction.jpg', TRUE, 2, 2),
('Django Unchained', 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.', 'https://example.com/django.jpg', FALSE, 2, 2),
('Jurassic Park', 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park''s cloned dinosaurs to run loose.', 'https://example.com/jurassicpark.jpg', TRUE, 3, 3),
('E.T. the Extra-Terrestrial', 'A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.', 'https://example.com/et.jpg', FALSE, 3, 1),
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://example.com/darkknight.jpg', TRUE, 1, 2),
('Inglourious Basterds', 'In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner''s vengeful plans for the same.', 'https://example.com/inglourious.jpg', FALSE, 2, 2),
('Ready Player One', 'When the creator of a virtual reality world called the OASIS dies, he releases a video in which he challenges all OASIS users to find his Easter Egg, which will give the finder his fortune.', 'https://example.com/readyplayer.jpg', FALSE, 3, 1),
('Dunkirk', 'Allied soldiers from Belgium, the British Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.', 'https://example.com/dunkirk.jpg', TRUE, 1, 3);

-- Insert data into Users table
INSERT INTO Users (Username, Password, Email, BirthDate) VALUES
('moviebuff', 'password123', 'moviebuff@example.com', '1990-01-01'),
('cinephile', 'securepass', 'cinephile@example.com', '1985-05-15'),
('filmfan', 'qwerty789', 'filmfan@example.com', '1995-12-31');

-- Insert data into Users_Movies table
INSERT INTO Users_Movies (UserID, MovieID) VALUES
(1, 1), (1, 3), (1, 5),
(2, 2), (2, 4), (2, 6),
(3, 7), (3, 8), (3, 9);