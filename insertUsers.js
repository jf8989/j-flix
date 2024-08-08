const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db("myFlixDB");
    const usersCollection = db.collection("users");

    const users = [
      {
        username: "user1",
        password: "password1",
        email: "user1@example.com",
        birthday: new Date("1990-01-15"),
        favoriteMovies: [],
      },
      {
        username: "user2",
        password: "password2",
        email: "user2@example.com",
        birthday: new Date("1985-05-22"),
        favoriteMovies: [],
      },
      {
        username: "user3",
        password: "password3",
        email: "user3@example.com",
        birthday: new Date("1992-11-30"),
        favoriteMovies: [],
      },
      {
        username: "user4",
        password: "password4",
        email: "user4@example.com",
        birthday: new Date("1988-07-04"),
        favoriteMovies: [],
      },
      {
        username: "user5",
        password: "password5",
        email: "user5@example.com",
        birthday: new Date("1995-03-18"),
        favoriteMovies: [],
      },
    ];

    const result = await usersCollection.insertMany(users);
    console.log(`${result.insertedCount} users were successfully inserted.`);
  } catch (err) {
    console.error("Error inserting users:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
