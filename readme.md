# j-Flix API

## 🎬 Project Overview

j-Flix is a robust server-side component of a movie web application. It provides users with access to information about different movies, directors, and genres. Users can sign up, update their personal information, and create a list of their favorite movies.

## 🚀 Features

### Essential Features

- Retrieve a list of all movies
- Get detailed information about a specific movie
- Access data about movie genres
- Obtain information about directors
- User registration and authentication
- Profile management (update user info)
- Favorite movies list management

### Optional Features (Future Implementation)

- Actor information and movie appearances
- Extended movie details (release date, ratings)
- "To Watch" list functionality

## 🛠 Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Architecture**: RESTful
- **Deployment**: Heroku

## 📋 API Endpoints

| Method | Endpoint                         | Description                   | Request Body                       | Response Body                        |
| ------ | -------------------------------- | ----------------------------- | ---------------------------------- | ------------------------------------ |
| GET    | /movies                          | Get all movies                | None                               | JSON array of movie objects          |
| GET    | /movies/:title                   | Get a specific movie by title | None                               | JSON object with movie details       |
| GET    | /genres/:name                    | Get genre information         | None                               | JSON object with genre details       |
| GET    | /directors/:name                 | Get director information      | None                               | JSON object with director details    |
| POST   | /users                           | Register a new user           | JSON object with user data         | JSON object with added user data     |
| PUT    | /users/:username                 | Update user information       | JSON object with updated user data | JSON object with updated user data   |
| POST   | /users/:username/movies/:movieId | Add a movie to favorites      | None                               | Text message confirming addition     |
| DELETE | /users/:username/movies/:movieId | Remove a movie from favorites | None                               | Text message confirming removal      |
| DELETE | /users/:username                 | Deregister a user             | None                               | Text message confirming user removal |

## 🔐 Authentication and Authorization

The API uses JWT for authentication and authorization. Users need to register and login to access protected endpoints.

## 🔧 Installation and Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (MongoDB URI, JWT Secret)
4. Start the server: `npm start`

## 🧪 Testing

API endpoints can be tested using Postman. Ensure to include the JWT token in the Authorization header for protected routes.

## 📚 Documentation

For detailed API documentation, please refer to the [API Documentation](public/documentation.html).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). This means you are free to:

- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

Under the following terms:

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- NonCommercial — You may not use the material for commercial purposes.

See the [LICENSE.md](LICENSE.md) file in the project root for the full license text.

## 👨‍💻 Author

Juan Francisco - Full Stack Developer in training

---

For any additional information or queries, please open an issue or contact the repository owner.
