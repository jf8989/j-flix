# j-Flix API 🎬

## Project Overview

j-Flix is the robust server-side component for a movie and series tracking web application. It provides users with access to detailed information about movies, series, directors, and genres. Users can register, manage their profile, and maintain lists of their favorite movies and series.

This API is designed to be consumed by a client-side application, such as the [J-Flix Angular Client](<https://jflix-client-2.vercel.app/welcome>).

## Features ✨

*   **User Management:** Secure user registration and login using JWT authentication. Ability to update profile information and deregister accounts.
*   **Movie Catalog:** Retrieve lists of all movies or specific movies by title. Access detailed information including description, genre, director, actors, release year, rating, and trailer links.
*   **Series Catalog:** Retrieve lists of all series or specific series by title. Access detailed information including description, creator, actors, air years, rating, genre, number of seasons, status, and trailer links.
*   **Detailed Lookups:** Get specific information about genres and directors (including bios).
*   **Favorites:** Add and remove both movies and series from a user's personalized favorites list.
*   **Filtering:** Fetch movies/series based on genre, actor, release year, rating, and series status.

## Technical Stack 🛠️

*   **Runtime Environment**: Node.js
*   **Web Framework**: Express.js
*   **Database**: MongoDB (Cloud: MongoDB Atlas / Local: Development DB)
*   **ODM**: Mongoose
*   **Authentication**: Passport.js with JWT (JSON Web Tokens) Strategy
*   **API Architecture**: RESTful
*   **Code Documentation**: JSDoc
*   **Deployment**: Vercel (Previously Heroku)

## API Endpoints 📋

All endpoints below (except `/users` (POST) and `/login` (POST)) require a valid JWT Bearer token in the `Authorization` header.

**Authentication**

| Method | Endpoint | Description         | Request Body                 | Response Body                      |
| :----- | :------- | :------------------ | :--------------------------- | :--------------------------------- |
| POST   | /login   | Authenticate a user | `{ "Username", "Password" }` | `{ user: UserObject, token: JWT }` |
| POST   | /users   | Register a new user | `{ User Details }`           | `{ user: UserObject }`             |

**Users**

| Method | Endpoint                          | Description                    | Request Body           | Response Body                    |
| :----- | :-------------------------------- | :----------------------------- | :--------------------- | :------------------------------- |
| PUT    | /users/:username                  | Update user information        | `{ Fields to Update }` | `UserObject` (updated)           |
| DELETE | /users/:username                  | Deregister a user              | None                   | `{ message: "User deleted..." }` |
| POST   | /users/:username/movies/:movieID  | Add a movie to favorites       | None                   | `UserObject` (updated)           |
| DELETE | /users/:username/movies/:movieID  | Remove a movie from favorites  | None                   | `UserObject` (updated)           |
| POST   | /users/:username/series/:seriesID | Add a series to favorites      | None                   | `UserObject` (updated)           |
| DELETE | /users/:username/series/:seriesID | Remove a series from favorites | None                   | `UserObject` (updated)           |

**Movies**

| Method | Endpoint                  | Description                   | Request Body | Response Body   |
| :----- | :------------------------ | :---------------------------- | :----------- | :-------------- |
| GET    | /movies                   | Get all movies                | None         | `[MovieObject]` |
| GET    | /movies/:title            | Get a specific movie by title | None         | `MovieObject`   |
| GET    | /movies/genre/:name       | Get movies by genre name      | None         | `[MovieObject]` |
| GET    | /movies/actor/:actorName  | Get movies by actor name      | None         | `[MovieObject]` |
| GET    | /movies/year/:year        | Get movies by release year    | None         | `[MovieObject]` |
| GET    | /movies/rating/:minRating | Get movies by min rating      | None         | `[MovieObject]` |

**Directors**

| Method | Endpoint                        | Description                 | Request Body       | Response Body                   |
| :----- | :------------------------------ | :-------------------------- | :----------------- | :------------------------------ |
| GET    | /directors/:name                | Get director information    | None               | `DirectorObject`                |
| PUT    | /directors/:name/bio            | Update director's bio       | `{ "bio": "..." }` | `{ message: "Updated bio..." }` |
| GET    | /directors/:directorName/movies | Get movies by director name | None               | `[MovieObject]`                 |

**Series**

| Method | Endpoint                       | Description                    | Request Body | Response Body    |
| :----- | :----------------------------- | :----------------------------- | :----------- | :--------------- |
| GET    | /series                        | Get all series                 | None         | `[SeriesObject]` |
| GET    | /series/title/:title           | Get a specific series by title | None         | `SeriesObject`   |
| GET    | /series/genre/:name            | Get series by genre name       | None         | `[SeriesObject]` |
| GET    | /series/status/:status         | Get series by status           | None         | `[SeriesObject]` |
| GET    | /series/actor/:actorName       | Get series by actor name       | None         | `[SeriesObject]` |
| GET    | /series/rating/:minRating      | Get series by min rating       | None         | `[SeriesObject]` |
| GET    | /series/year-range/:start/:end | Get series by year range       | None         | `[SeriesObject]` |

*(Note: `UserObject`, `MovieObject`, `SeriesObject`, `DirectorObject` represent the structure defined in the Mongoose models.)*

## Installation and Setup 🔧

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repository-folder>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the project root and add the following variables:
    ```
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    # NODE_ENV=development (Optional: for local development DB)
    ```
4.  **Start the server:**
    *   For development (uses settings potentially defined for local DB in `config/db.js`):
        ```bash
        npm run dev
        ```
    *   For production mode:
        ```bash
        npm start
        ```

## Testing 🧪

API endpoints can be tested using tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/). Remember to:

1.  Register a user via `POST /users`.
2.  Login via `POST /login` to obtain a JWT token.
3.  Include the obtained token in the `Authorization` header for all protected routes (e.g., `Authorization: Bearer <your_token>`).

## Documentation 📚

Detailed documentation for the API, including function descriptions, parameters, and route details, has been generated using JSDoc.

**To view the documentation:**

1.  Ensure you have run `npm install` to install dev dependencies (including `jsdoc`).
2.  Generate the documentation (if not already present):
    ```bash
    npx jsdoc -c jsdoc.json
    ```
3.  Open the generated `docs/jsdoc/index.html` file in your web browser.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Please feel free to submit a Pull Request or open an issue.

## License 📄

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). This means you are free to:

*   **Share** — copy and redistribute the material in any medium or format
*   **Adapt** — remix, transform, and build upon the material

Under the following terms:

*   **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
*   **NonCommercial** — You may not use the material for commercial purposes.

See the [LICENSE.md](LICENSE.md) file in the project root for the full license text.

## Author 👨‍💻

**Juan Francisco Marcenaro A.** - Full Stack Developer in training

---

*For any additional information or queries, please open an issue.*