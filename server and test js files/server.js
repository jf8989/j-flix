// Import required modules
const http = require("http");
const fs = require("fs");
const url = require("url");

// Define the hostname and port
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
    if (err) console.error("Failed to write to log file", err);
  });

  // Determine the file path based on the URL
  let filePath = "";
  if (path.includes("documentation")) {
    filePath = "./documentation.html";
  } else if (path === "/" || path === "/index.html") {
    filePath = "./index.html";
  }

  if (filePath) {
    // Read and serve the requested file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Failed to read file", err);
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else {
    // If the path does not match, send a 404 response
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("404 Not Found");
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
