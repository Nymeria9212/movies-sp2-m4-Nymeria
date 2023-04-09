import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { TMovies } from "./interfaces";
import format from "pg-format";

const ensureMovieExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
    SELECT 
      * 
    FROM 
      movies 
    WHERE 
      id= $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      error: "Movie not found",
    });
  }

  response.locals.movie = queryResult.rows[0];
  return next();
};

const ensureCategory = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { category } = request.query;

  const queryString: string = format(`
        SELECT * FROM 
            movies 
        WHERE 
            category=$1;
        `);

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [category],
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  const queryString2: string = `
    SELECT * FROM movies;
    `;
  const queryResult2: QueryResult<TMovies> = await client.query(queryString2);

  if (queryResult.rowCount > 0) {
    return response.status(200).json(queryResult.rows);
  }

  return response.status(200).json(queryResult2.rows);
};

export { ensureMovieExist, ensureCategory };
