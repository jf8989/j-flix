const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db("myFlixDB");
    const moviesCollection = db.collection("movies");
    const usersCollection = db.collection("users");

    // Get some movie IDs
    const movies = await moviesCollection.find().limit(3).toArray();
    const movieIds = movies.map(movie => movie._id);

    // Update users with favorite movies
    const updateResult = await usersCollection.updateMany(
      {}, // Update all users
      { $set: { favoriteMovies: movieIds } }
    );

    console.log(`${updateResult.modifiedCount} users were updated with favorite movies.`);

    // Verify the update
    const updatedUsers = await usersCollection.find({}).toArray();
    console.log("Updated users:");
    console.log(JSON.stringify(updatedUsers, null, 2));

  } catch (err) {
    console.error("Error updating users:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);