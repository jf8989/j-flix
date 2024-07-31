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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /movies  | Get all movies |
| GET    | /movies/:title | Get a specific movie by title |
| GET    | /genres/:name | Get genre information |
| GET    | /directors/:name | Get director information |
| POST   | /users  | Register a new user |
| PUT    | /users/:username | Update user information |
| POST   | /users/:username/movies/:movieId | Add a movie to favorites |
| DELETE | /users/:username/movies/:movieId | Remove a movie from favorites |
| DELETE | /users/:username | Deregister a user |

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

For detailed API documentation, please refer to the [API Documentation](link-to-your-api-docs).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Juan Francisco - Full Stack Developer in training

---

For any additional information or queries, please open an issue or contact the repository owner.