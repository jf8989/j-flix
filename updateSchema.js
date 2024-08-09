const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function updateSchema() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("myFlixDB");
    
    // Update existing movies with sample data
    const movies = await db.collection('movies').find().toArray();
    
    for (let movie of movies) {
      const updateDoc = {
        $set: {
          actors: generateSampleActors(),
          rating: generateSampleRating(),
          releaseYear: movie.year || generateSampleYear()
        }
      };
      
      await db.collection('movies').updateOne({ _id: movie._id }, updateDoc);
    }
    
    console.log(`Updated ${movies.length} movies with sample data`);
    
    // Create directors collection (if it doesn't exist)
    if (!(await db.listCollections({name: 'directors'}).hasNext())) {
      await db.createCollection("directors");
      console.log("Created directors collection");
    }
    
    // Populate directors collection
    const pipeline = [
      {
        $group: {
          _id: "$director.name",
          bio: { $first: "$director.bio" },
          birthYear: { $first: "$director.birthYear" },
          deathYear: { $first: "$director.deathYear" },
          movies: { $push: "$_id" }
        }
      },
      {
        $project: {
          name: "$_id",
          _id: 0,
          bio: 1,
          birthYear: 1,
          deathYear: 1,
          movies: 1
        }
      },
      { $out: "directors" }
    ];
    
    await db.collection('movies').aggregate(pipeline).toArray();
    console.log("Populated directors collection");
    
    console.log("Schema update completed successfully");
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    await client.close();
  }
}

function generateSampleActors() {
  const actorPool = [
    "Tom Hanks", "Meryl Streep", "Leonardo DiCaprio", "Viola Davis",
    "Denzel Washington", "Cate Blanchett", "Brad Pitt", "Scarlett Johansson"
  ];
  const numActors = Math.floor(Math.random() * 3) + 2; // 2 to 4 actors
  return actorPool.sort(() => 0.5 - Math.random()).slice(0, numActors);
}

function generateSampleRating() {
  return (Math.random() * 4 + 6).toFixed(1); // Rating between 6.0 and 10.0
}

function generateSampleYear() {
  return Math.floor(Math.random() * (2023 - 1990 + 1)) + 1990; // Year between 1990 and 2023
}

updateSchema();