import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const movies = sqliteTable("movies", {
  id: integer("id", { mode: "number" }).primaryKey(),
  title: text("title").notNull(),
  genre: text("genre"),
  releaseDate: text("release_date"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const userRatings = sqliteTable("user_ratings", {
  userId: integer("user_id").notNull().references(() => users.id),
  movieId: integer("movie_id").notNull().references(() => movies.id),
  rating: integer("rating", { mode: "number" }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.movieId] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  ratings: many(userRatings),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  ratings: many(userRatings),
}));