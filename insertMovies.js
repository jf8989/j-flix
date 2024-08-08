const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db("myFlixDB");
    const moviesCollection = db.collection("movies");

    const movies = [
      {
        title: "Inception",
        description:
          "A thief who enters the dreams of others to steal secrets from their subconscious.",
        genre: {
          name: "Science Fiction",
          description: "Futuristic and imaginative concepts",
        },
        director: {
          name: "Christopher Nolan",
          bio: "British-American film director known for his complex narratives",
          birthYear: 1970,
        },
        imageURL: "https://via.placeholder.com/300x450.png?text=Inception",
        featured: true,
        year: 2010,
      },
      {
        title: "The Shawshank Redemption",
        description:
          "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: {
          name: "Drama",
          description:
            "Emotionally-driven narratives focused on character development",
        },
        director: {
          name: "Frank Darabont",
          bio: "American filmmaker and screenwriter known for his Stephen King adaptations",
          birthYear: 1959,
        },
        imageURL:
          "https://via.placeholder.com/300x450.png?text=Shawshank+Redemption",
        featured: true,
        year: 1994,
      },
      {
        title: "The Godfather",
        description:
          "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        genre: {
          name: "Crime",
          description:
            "Stories involving criminal activities and their consequences",
        },
        director: {
          name: "Francis Ford Coppola",
          bio: "American film director, producer, and screenwriter",
          birthYear: 1939,
        },
        imageURL: "https://via.placeholder.com/300x450.png?text=The+Godfather",
        featured: true,
        year: 1972,
      },
      {
        title: "Pulp Fiction",
        description:
          "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        genre: {
          name: "Crime",
          description:
            "Stories involving criminal activities and their consequences",
        },
        director: {
          name: "Quentin Tarantino",
          bio: "American film director, screenwriter, and actor known for nonlinear storylines",
          birthYear: 1963,
        },
        imageURL: "https://via.placeholder.com/300x450.png?text=Pulp+Fiction",
        featured: false,
        year: 1994,
      },
      {
        title: "The Dark Knight",
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genre: {
          name: "Action",
          description: "Fast-paced and full of exciting sequences",
        },
        director: {
          name: "Christopher Nolan",
          bio: "British-American film director known for his complex narratives",
          birthYear: 1970,
        },
        imageURL:
          "https://via.placeholder.com/300x450.png?text=The+Dark+Knight",
        featured: true,
        year: 2008,
      },
      {
        title: "Star Trek: Nemesis",
        description:
          "The Enterprise is diverted to the Romulan homeworld Romulus, supposedly because they want to negotiate a peace treaty.",
        genre: {
          name: "Science Fiction",
          description: "Futuristic and imaginative concepts",
        },
        director: {
          name: "Stuart Baird",
          bio: "English film editor, producer, and director",
          birthYear: 1947,
        },
        imageURL:
          "https://via.placeholder.com/300x450.png?text=Star+Trek:+Nemesis",
        featured: false,
        year: 2002,
      },
      {
        title: "Star Trek",
        description:
          "The brash James T. Kirk tries to live up to his father's legacy with Mr. Spock keeping him in check as a vengeful Romulan from the future creates black holes to destroy the Federation one planet at a time.",
        genre: {
          name: "Science Fiction",
          description: "Futuristic and imaginative concepts",
        },
        director: {
          name: "J.J. Abrams",
          bio: "American filmmaker known for his work in the science fiction and action genres",
          birthYear: 1966,
        },
        imageURL: "https://via.placeholder.com/300x450.png?text=Star+Trek",
        featured: true,
        year: 2009,
      },
      {
        title: "Star Trek Into Darkness",
        description:
          "After the crew of the Enterprise find an unstoppable force of terror from within their own organization, Captain Kirk leads a manhunt to a war-zone world to capture a one-man weapon of mass destruction.",
        genre: {
          name: "Science Fiction",
          description: "Futuristic and imaginative concepts",
        },
        director: {
          name: "J.J. Abrams",
          bio: "American filmmaker known for his work in the science fiction and action genres",
          birthYear: 1966,
        },
        imageURL:
          "https://via.placeholder.com/300x450.png?text=Star+Trek+Into+Darkness",
        featured: false,
        year: 2013,
      },
      {
        title: "Star Trek Beyond",
        description:
          "The crew of the USS Enterprise explores the furthest reaches of uncharted space, where they encounter a new ruthless enemy, who puts them, and everything the Federation stands for, to the test.",
        genre: {
          name: "Science Fiction",
          description: "Futuristic and imaginative concepts",
        },
        director: {
          name: "Justin Lin",
          bio: "Taiwanese-American film director known for the Fast & Furious franchise",
          birthYear: 1971,
        },
        imageURL:
          "https://via.placeholder.com/300x450.png?text=Star+Trek+Beyond",
        featured: false,
        year: 2016,
      },
      {
        title: "Interstellar",
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: {
          name: "Science Fiction",
          description: "Futuristic and imaginative concepts",
        },
        director: {
          name: "Christopher Nolan",
          bio: "British-American film director known for his complex narratives",
          birthYear: 1970,
        },
        imageURL: "https://via.placeholder.com/300x450.png?text=Interstellar",
        featured: true,
        year: 2014,
      },
    ];

    const result = await moviesCollection.insertMany(movies);
    console.log(`${result.insertedCount} movies were successfully inserted.`);
  } catch (err) {
    console.error("Error inserting movies:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
