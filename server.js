// Import the http module to create the server
const http = require("http");

// Import the fs (file system) module to read files and append logs
const fs = require("fs");

// Import the url module to parse the request URL
const url = require("url");

// Define the hostname and port where the server will listen
const hostname = "127.0.0.1";
const port = 8080;

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL of the incoming request
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Log the request URL and timestamp
  const logEntry = `URL: ${req.url}, Timestamp: ${new Date().toISOString()}\n`;
  fs.appendFile("log.txt", logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file", err);
    }
  });

  // Determine the file path based on the URL
  let filePath = "";
  if (path.includes("documentation")) {
    filePath = "documentation.html";
  } else if (path === "/" || path === "/index.html") {
    filePath = "index.html";
  } else {
    filePath = "";
  }

  if (filePath) {
    // Read and serve the requested file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        // If there's an error (e.g., file not found), send a 404 response
        console.error("Failed to read file", err);
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("Not Found");
      } else {
        // If the file is read successfully, send a 200 response with the file content
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
      }
      // End the response
      res.end();
    });
  } else {
    // If the path does not match, send a 404 response
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write("Not Found");
    res.end();
  }
});

// Start the server and listen on the specified port and hostname
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
