import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/user";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class NewUserInput implements Partial<User> {
  @Field()
  mail: string;

  @Field()
  password: string;
}

@Resolver()
class UserResolver {
  @Mutation(() => String)
  async createUser(@Arg("data") userData: NewUserInput) {
    console.log("new user data", userData);
    const hashedPassword = await argon2.hash(userData.password);
    await User.save({
      mail: userData.mail,
      hashedPassword,
      roles: "USER",
    });
    return "User created";
  }

  @Query(() => String)
  async login(@Arg("data") userData: NewUserInput) {
    try {
      if (!process.env.JWT_SECRET) throw new Error();
      const user = await User.findOneByOrFail({ mail: userData.mail });
      const isValid = await argon2.verify(
        user.hashedPassword,
        userData.password
      );
      if (!isValid) throw new Error();

      const token = jwt.sign(
        { mail: user.mail, roles: user.roles, id: user.id },
        process.env.JWT_SECRET
      );
      return token;
      return {
        token,
        user: {
          // Public data used to customize front app
          mail: user.mail,
        },
      };
    } catch (err) {
      throw new Error("Login error");
    }
  }
}

export default UserResolver;
