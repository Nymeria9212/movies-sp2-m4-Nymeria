import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import { TMovies, TMoviesRequest } from "./interfaces";
import format from "pg-format";

const createMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const moviesData: TMoviesRequest = request.body;

  const queryString: string = format(
    `
        INSERT INTO
            movies
            (%I)
        VALUES 
            (%L)
        RETURNING *;
    `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );
  console.log(queryString);

  const queryResult: QueryResult<TMovies> = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const readMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = `
  SELECT * FROM movies;
  `;
  const queryResult: QueryResult<TMovies> = await client.query(queryString);

  return response.status(200).json(queryResult.rows);
};

const readMovieId = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const movie: TMovies = response.locals.movie;

  return response.status(200).json(movie);
};

const updateMovieId = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const dataRequest: Partial<TMoviesRequest> = request.body;
  const id: number = parseInt(request.params.id);
  const queryString: string = format(
    `
  UPDATE
      movies
      SET (%I) = ROW(%L)
  WHERE
      id=$1
  RETURNING *;

  `,
    Object.keys(dataRequest),
    Object.values(dataRequest)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const deleteMovieId = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
  DELETE FROM
    movies
  WHERE
    id=$1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  console.log(queryConfig);

  await client.query(queryConfig);

  return response.status(204).send();
};

export { createMovies, readMovieId, readMovies, updateMovieId, deleteMovieId };
