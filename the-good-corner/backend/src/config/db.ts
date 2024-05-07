import { Category } from "../entities/category";
import { Ad } from "../entities/ad";
import { DataSource } from "typeorm";
import { Tag } from "../entities/tag";
import * as dotenv from "dotenv";
import { User } from "../entities/user";

dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.PGPORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: ["error", "query"],
  entities: [Ad, Category, Tag, User],
});
