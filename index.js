// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const os = require('os');

// Initialize Express application
const app = express();

// Middleware setup
app.use(bodyParser.json());  // Parse JSON bodies in requests
app.use(morgan('common'));   // Log HTTP requests
app.use(express.static('public'));  // Serve static files from 'public' directory

// Set the port for the server
const port = 8080;

/**
 * Function to get the local IP address
 * @returns {string} The local IP address or 'localhost' if not found
 */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (const item of interface) {
      if (item.family === 'IPv4' && !item.internal) {
        return item.address;
      }
    }
  }
  return 'localhost';
}

// Route for the root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to j-Flix!');
});

// Route for the /movies endpoint
app.get('/movies', (req, res) => {
  // Return a JSON array of 10 movies
  res.json([
    { title: 'Inception', director: 'Christopher Nolan' },
    { title: 'The Shawshank Redemption', director: 'Frank Darabont' },
    { title: 'The Godfather', director: 'Francis Ford Coppola' },
    { title: 'Pulp Fiction', director: 'Quentin Tarantino' },
    { title: 'The Dark Knight', director: 'Christopher Nolan' },
    { title: 'Schindler\'s List', director: 'Steven Spielberg' },
    { title: 'Forrest Gump', director: 'Robert Zemeckis' },
    { title: 'The Matrix', director: 'The Wachowskis' },
    { title: 'Goodfellas', director: 'Martin Scorsese' },
    { title: 'Fight Club', director: 'David Fincher' }
  ]);
});

// Middleware for handling 404 errors (routes not found)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Something broke!');
});

// Get the local IP address
const localIpAddress = getLocalIpAddress();

// Start the server
app.listen(port, () => {
  console.log(`j-Flix server is running on port ${port}`);
  console.log(`Local:   http://localhost:${port}`);
  console.log(`Network: http://${localIpAddress}:${port}`);
});