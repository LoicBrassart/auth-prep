import "reflect-metadata";
import { buildSchema } from "type-graphql";
import AdResolver from "./resolvers/AdResolver";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { dataSource } from "./config/db";
import CategoryResolver from "./resolvers/CategoryResolver";
import TagResolver from "./resolvers/TagResolver";
import UserResolver from "./resolvers/UserResolver";
import * as jwt from "jsonwebtoken";

const start = async () => {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [AdResolver, CategoryResolver, TagResolver, UserResolver],
    authChecker: ({ context }, neededRoles) => {
      console.log("authChecker:context", context);
      if (!context.mail) return false;

      //Insert logic here
      // ADMIN can access any route
      if (context.roles.includes("ADMIN")) return true;

      // Check user's roles against route's requirements
      const validRoles = neededRoles.filter((elt) =>
        context.roles.split("|").includes(elt)
      );
      return validRoles.length > 0;
    },
  });

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      if (!req.headers.authorization) return {};
      if (!process.env.JWT_SECRET) return {};

      try {
        const payload = jwt.verify(
          req.headers.authorization.split("Bearer ")[1],
          process.env.JWT_SECRET
        );

        if (typeof payload === "string") return {};
        return payload;
      } catch (err) {
        return {};
      }
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

start();
