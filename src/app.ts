import express, { Application, json, response } from "express";
import { startDatabase } from "./database";
import {
  createMovies,
  deleteMovieId,
  readMovieId,
  readMovies,
  updateMovieId,
} from "./logic";
import { ensureCategory, ensureMovieExist } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", createMovies);
app.get("/movies", ensureCategory, readMovies);
app.get("/movies/:id", ensureMovieExist, readMovieId);
app.patch("/movies/:id", ensureMovieExist, updateMovieId);
app.delete("/movies/:id", ensureMovieExist, deleteMovieId);

app.listen(3000, async () => {
  await startDatabase(), console.log("Server running on http://localhost:3000");
});
