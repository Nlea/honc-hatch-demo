import { instrument } from "@fiberplane/hono-otel";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Welcome to the Holiday Movie Recommendation API!");
});

app.get("/api/users", async (c) => {
  const db = drizzle(c.env.DB);
  const users = await db.select().from(schema.users);
  return c.json({ users });
});

app.post("/api/user", async (c) => {
  const db = drizzle(c.env.DB);
  const { name, email } = await c.req.json();

  const [newUser] = await db.insert(schema.users).values({
    name: name,
    email: email,
  }).returning();

  return c.json(newUser);
});

app.get("/api/movies", async (c) => {
  const db = drizzle(c.env.DB);
  const movies = await db.select().from(schema.movies);
  return c.json({ movies });
});

app.post("/api/movie", async (c) => {
  const db = drizzle(c.env.DB);
  const { title, genre, releaseDate } = await c.req.json();

  const [newMovie] = await db.insert(schema.movies).values({
    title: title,
    genre: genre,
    releaseDate: releaseDate,
  }).returning();

  return c.json(newMovie);
});

app.put("/api/movie/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = Number.parseInt(c.req.param("id"));
  const { title, genre, releaseDate } = await c.req.json();

  const [updatedMovie] = await db.update(schema.movies)
    .set({ title, genre, releaseDate })
    .where(eq(schema.movies.id, id))
    .returning();

  return c.json(updatedMovie);
});

app.delete("/api/movie/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = Number.parseInt(c.req.param("id"));

  await db.delete(schema.movies).where(eq(schema.movies.id, id));

  return c.text("Movie deleted successfully.");
});

// TODO: Implement streaming or realtime features for movie recommendations
// Streaming: https://hono.dev/docs/helpers/streaming#streaming-helper
// Realtime: https://developers.cloudflare.com/durable-objects/
//           https://fiberplane.com/blog/creating-websocket-server-hono-durable-objects/

export default instrument(app);