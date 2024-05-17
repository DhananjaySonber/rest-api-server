const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

// Loading data from JSON file
const loadMoviesFromFile = () => {
  const filePath = path.join(__dirname, "movies.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData);
};

// Get all movies
app.get("/movies", (req, res) => {
  const movies = loadMoviesFromFile();
  res.status(200).json(movies);
});

// Create a movie
app.post("/movies", (req, res) => {
  const movies = loadMoviesFromFile();
  const newMovie = req.body;
  movies.push(newMovie);

  fs.writeFileSync(
    path.join(__dirname, "movies.json"),
    JSON.stringify(movies, null, 2)
  );

  res.status(201).json(newMovie);
});

// Get a movie by index
app.get("/movies/:index", (req, res) => {
  const movies = loadMoviesFromFile();
  const movie = movies[req.params.index];

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.status(200).json(movie);
});

// Update a movie by index
app.put("/movies/:index", (req, res) => {
  const movies = loadMoviesFromFile();
  const index = req.params.index;
  if (!movies[index]) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies[index] = req.body;
  fs.writeFileSync(
    path.join(__dirname, "movies.json"),
    JSON.stringify(movies, null, 2)
  );

  res.status(200).json(movies[index]);
});

// Delete a movie by index
app.delete("/movies/:index", (req, res) => {
  const movies = loadMoviesFromFile();
  const index = req.params.index;

  if (!movies[index]) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const deletedMovie = movies.splice(index, 1);
  fs.writeFileSync(
    path.join(__dirname, "movies.json"),
    JSON.stringify(movies, null, 2)
  );

  res.status(200).json(deletedMovie);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
