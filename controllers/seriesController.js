// controllers/seriesController.js
const Series = require("../models/Series");

// Get all series from the database
async function getAllSeries(req, res) {
  try {
    const series = await Series.find();
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get a series by its title
async function getSeriesByTitle(req, res) {
  try {
    const series = await Series.findOne({ title: req.params.title });
    if (series) {
      res.json(series);
    } else {
      res.status(404).send("Series not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by genre
async function getSeriesByGenre(req, res) {
  try {
    const genreName = req.params.name;
    const series = await Series.find({
      "genres.name": genreName,
    });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by status
async function getSeriesByStatus(req, res) {
  try {
    const series = await Series.find({ status: req.params.status });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by actor
async function getSeriesByActor(req, res) {
  try {
    const series = await Series.find({ actors: req.params.actorName });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by minimum rating
async function getSeriesByRating(req, res) {
  try {
    const series = await Series.find({
      rating: { $gte: parseFloat(req.params.minRating) },
    });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by release year range
async function getSeriesByYearRange(req, res) {
  try {
    const series = await Series.find({
      firstAirYear: {
        $gte: parseInt(req.params.startYear),
        $lte: parseInt(req.params.endYear),
      },
    });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

module.exports = {
  getAllSeries,
  getSeriesByTitle,
  getSeriesByGenre,
  getSeriesByStatus,
  getSeriesByActor,
  getSeriesByRating,
  getSeriesByYearRange,
};
